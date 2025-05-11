import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react'
import { createATA } from './ata';
import { editor } from 'monaco-editor'

export interface EditorFile {
    name: string
    value: string
    language: string
}

interface Props {
    file: EditorFile
    onChange?: EditorProps['onChange'],
    options?: editor.IStandaloneEditorConstructionOptions
}

export default function Editor(props: Props) {

    const {
        file,
        onChange,
        options
    } = props;

    const handleEditorMount: OnMount = (editor, monaco) => {
        console.log('editor mounted'); // 首次挂载时触发！
        // 添加快捷键：ctrl+j 格式化代码
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction('editor.action.formatDocument')?.run()
            // let actions = editor.getSupportedActions().map((a) => a.id);
            // console.log(actions);
        });

        // 设置typescript默认配置
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            // 这个选项决定了编辑器如何处理 JSX 语法
            // Preserve 表示保持 JSX 语法不变，不会将其转换为普通的 JavaScript，即React.createElement()的形式
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
            // CommonJS 和 ES Modules 之间的互操作性问题
            // 让你可以用更现代的 import 语法
            esModuleInterop: true,
        })

        const ata = createATA((code, path) => {
            // 类型定义下载完成后的回调，将类型定义添加到monaco编辑器中
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        })

        // 监听代码变化
        editor.onDidChangeModelContent(() => {
            console.log('editor.onDidChangeModelContent~') // 每一下编辑都会触发，频繁触发！
            // 文件代码变化，重新分析代码，获取类型定义
            ata(editor.getValue());
        });

        ata(editor.getValue());
    }

    return <MonacoEditor
        height={'100%'}
        path={file.name}
        language={file.language}
        onMount={handleEditorMount} // 首次挂载完成时
        onChange={onChange} // 内容变化时
        value={file.value} // 当前文件内容（切换文件时会更新）
        options={
            {
                fontSize: 14, // 字体大小
                scrollBeyondLastLine: false, // 是否滚动到最后一行
                minimap: {
                  enabled: false, // 是否显示小地图
                },
                scrollbar: {
                  verticalScrollbarSize: 6, // 垂直滚动条大小
                  horizontalScrollbarSize: 6, // 水平滚动条大小
                },
                ...options
            }
        }
    />
}
