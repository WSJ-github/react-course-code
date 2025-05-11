import { transform } from '@babel/standalone' // web可独立运行版本的babel
import { File, Files } from '../../PlaygroundContext'
import { ENTRY_FILE_NAME } from '../../files'
import { PluginObj } from '@babel/core';

/**
 * 在编译前，处理代码
 * ：如果文件是jsx或tsx，并且没有导入React，则添加import React from 'react';
 * 原因：编译后的代码运行时是React.createElement()的形式，需要导入React，不然运行时会错误
 */
export const beforeTransformCode = (filename: string, code: string) => {
    let _code = code
    const regexReact = /import\s+React/g
    if ((filename.endsWith('.jsx') || filename.endsWith('.tsx')) && !regexReact.test(code)) {
      _code = `import React from 'react';\n${code}`
    }
    return _code
}

/**
 * 使用babel编译代码
 * 1. 在编译前，处理代码
 * 2. 使用babel编译代码
 * 3. 返回编译后的代码
 */
export const babelTransform = (filename: string, code: string, files: Files) => {
    let _code = beforeTransformCode(filename, code);
    let result = ''
    try {
        // 使用babel编译代码
        result = transform(_code, {
        presets: ['react', 'typescript'], // babel预设
        filename,
        plugins: [customResolver(files)], // 自定义babel插件
        retainLines: true // 保留行号
        }).code!
    } catch (e) {
        console.error('编译出错', e);
    }
    return result
}

/**
 * 根据模块路径，获取对应的文件对象
 */
const getModuleFile = (files: Files, modulePath: string) => {
    let moduleName = modulePath.split('./').pop() || ''
    if (!moduleName.includes('.')) { // 如果模块名没有包含扩展名
        const realModuleName = Object.keys(files).filter(key => {
            return key.endsWith('.ts') 
                || key.endsWith('.tsx') 
                || key.endsWith('.js')
                || key.endsWith('.jsx')
        }).find((key) => {
            return key.split('.').includes(moduleName)
        })
        if (realModuleName) {
            moduleName = realModuleName
        }
      }
    return files[moduleName]
}

const json2Js = (file: File) => {
    const js = `export default ${file.value}`
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

const css2Js = (file: File) => {
    const randomId = new Date().getTime()
    const js = `
(() => {
    console.log('css2Js', '${randomId}_${file.name}')
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

/**
 * 自定义babel插件
 * 1. 在编译时，如果遇到import语句，则根据import的模块路径，获取模块文件对象，并将其转换为js或css
 * 2. 如果模块文件是css或json，则将其转换为js
 * 3. 如果模块文件是js或jsx，则将其转换为js
 * 
 */
function customResolver(files: Files): PluginObj {
    return {
        visitor: {
            ImportDeclaration(path) {
                const modulePath = path.node.source.value // 获取import的模块路径
                if(modulePath.startsWith('.')) { // 只对相对路径的模块进行处理，绝对路径的走importMap
                    const file = getModuleFile(files, modulePath)
                    if(!file) 
                        return // 找不到模块文件，则不处理，保留原样，后续iframe中运行报错会推送到父窗口中

                    // 如果找到对应的模块文件，则根据文件类型进行处理
                    // ：转换成 Blob 的方式，并且修改path.node.source.value（即模块的导入路径变更为blob url的方式）
                    if (file.name.endsWith('.css')) {
                        path.node.source.value = css2Js(file)
                    } else if (file.name.endsWith('.json')) {
                        path.node.source.value = json2Js(file)
                    } else {
                        // js/jsx ts/tsx 文件，递归编译，都转化为blob，并且通过blob url的方式导入
                        path.node.source.value = URL.createObjectURL(
                            new Blob([babelTransform(file.name, file.value, files)], {
                                type: 'application/javascript',
                            })
                        )
                    }
                }
            }
        }
    }
}

/**开启编译流程 */
export const compile = (files: Files) => {
  // 取出主入口文件对象，从入口开始使用babel递归编译，返回编译后的内容
  const main = files[ENTRY_FILE_NAME]
  return babelTransform(ENTRY_FILE_NAME, main.value, files)
}

self.addEventListener('message', async ({ data }) => { // data对应全局files
    try {
        self.postMessage({
            type: 'COMPILED_CODE',
            data: compile(data)
        })
    } catch (e) {
      self.postMessage({ type: 'ERROR', error: e })
    }
})
