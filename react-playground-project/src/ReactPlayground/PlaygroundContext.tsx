import React, { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { compress, fileName2Language, uncompress } from './utils'
import { initFiles } from './files'

export interface File {
  name: string // 文件名
  value: string // 文件内容（raw代码内容）
  language: string // 文件语言
}

export interface Files {
  [key: string]: File
}

export interface PlaygroundContext {
  files: Files // 全局维护的文件列表
  selectedFileName: string // 当前选中的文件名
  theme: Theme // 当前主题
  setTheme: (theme: Theme) => void // 设置主题
  setSelectedFileName: (fileName: string) => void // 设置当前选中的文件名
  setFiles: (files: Files) => void // 设置全局文件列表
  addFile: (fileName: string) => void // 添加文件
  removeFile: (fileName: string) => void // 删除文件
  updateFileName: (oldFieldName: string, newFieldName: string) => void // 更新文件名
}

export type Theme = 'light' | 'dark'

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: 'App.tsx',
} as PlaygroundContext)

/**
 * 解压url hash，获取文件列表
 */
const getFilesFromUrl = () => {
  let files: Files | undefined
  try {
      const hash = uncompress(window.location.hash.slice(1))
      files = JSON.parse(hash)
  } catch (error) {
    console.error(error)
  }
  return files
}

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props
  // 全局文件列表
  // 初始值：分享链接 或者 初始化默认值
  const [files, setFiles] = useState<Files>( getFilesFromUrl() || initFiles)
  const [selectedFileName, setSelectedFileName] = useState('App.tsx'); // 当前选中的文件名，默认是App.tsx
  const [theme, setTheme] = useState<Theme>('light') // 当前主题，默认是light

  const addFile = (name: string) => {
    files[name] = {
      name,
      language: fileName2Language(name),
      value: '', // 默认新增文件内容为空
    }
    setFiles({ ...files })
  }

  const removeFile = (name: string) => {
    delete files[name]
    setFiles({ ...files })
  }

  /**
   * 修改文件名
   * @param oldFieldName 旧文件名
   * @param newFieldName 新文件名
   */
  const updateFileName = (oldFieldName: string, newFieldName: string) => {
    if (!files[oldFieldName] || newFieldName === undefined || newFieldName === null) return
    const { [oldFieldName]: value, ...rest } = files
    const newFile = {
      [newFieldName]: {
        ...value,
        language: fileName2Language(newFieldName),
        name: newFieldName,
      },
    }
    setFiles({
      ...rest,
      ...newFile,
    })
  }

  useEffect(() => {
    // 监听文件列表变化，文件内容有变化，就同步压缩序列化文件列表，并更新url hash
    const hash = compress(JSON.stringify(files))
    window.location.hash = hash
  }, [files])

  return (
    <PlaygroundContext.Provider
      value={{
        theme,
        setTheme,
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}
