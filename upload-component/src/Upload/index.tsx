import { FC, useRef, ChangeEvent, PropsWithChildren, useState } from 'react'
import axios from 'axios'

import './index.scss';
import UploadList, { UploadFile } from './UploadList';
import Dragger from './Dragger';

export interface UploadProps extends PropsWithChildren{
  action: string; // 上传的地址
  headers?: Record<string, any>; // 请求头
  name?: string; // 上传的文件名
  data?: Record<string, any>; // 上传的文件数据
  withCredentials?: boolean; // 是否携带凭证
  accept?: string; // 限制input文件框上传的文件类型
  multiple?: boolean; // 是否支持多选
  beforeUpload? : (file: File) => boolean | Promise<File>; // 上传前的钩子
  onProgress?: (percentage: number, file: File) => void; // 上传中进度钩子
  onSuccess?: (data: any, file: File) => void; // 上传成功的钩子
  onError?: (err: any, file: File) => void; // 上传失败的钩子
  onChange?: (file: File) => void; // 上传文件状态改变的钩子
  onRemove?: (file: UploadFile) => void; // 删除文件的钩子
  drag: boolean; // 是否开启拖拽上传
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove,
    drag
  } = props

  const fileInput = useRef<HTMLInputElement>(null);

  const [ fileList, setFileList ] = useState<Array<UploadFile>>([]); // 文件列表

  // 更新文件列表
  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj }
        } else {
          return file
        }
      })
    })
  }

  // 删除文件
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    if (onRemove) {
      onRemove(file)
    }
  }

  // 点击上传按钮
  const handleClick = () => {
    if (fileInput.current) {
        fileInput.current.click()
    }
  }

  // 文件选择框改变
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files) {
        return
    }
    uploadFiles(files)
    // 清空文件选择框
    if (fileInput.current) {
        fileInput.current.value = ''
    }
  }

  // 上传文件
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files)
    postFiles.forEach(file => {
        if (!beforeUpload) {
            post(file)
        } else {
            const result = beforeUpload(file)
            if (result && result instanceof Promise) {
                result.then(processedFile => {
                    post(processedFile)
                })
            } else if (result !== false) {
                post(file)
            }
        }
    })
  }

  // 上传文件
  const post = (file: File) => {
    let uploadFile: UploadFile = {
        uid: Date.now() + 'upload-file',
        status: 'ready',
        name: file.name,
        size: file.size,
        percent: 0,
        raw: file
    }
    setFileList(prevList => {
        return [uploadFile, ...prevList]
    })

    const formData = new FormData()

    formData.append(name || 'file', file);
    if (data) {
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
    } 

    axios.post(action, formData, {
        headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
        },
        withCredentials,
        onUploadProgress: (e) => {
            let percentage = Math.round((e.loaded * 100) / e.total!) || 0;
            if (percentage < 100) {
                updateFileList(uploadFile, { percent: percentage, status: 'uploading'});

                if (onProgress) {
                    onProgress(percentage, file)
                }
            }
        }
    }).then(resp => {
        updateFileList(uploadFile, {status: 'success', response: resp.data})

        onSuccess?.(resp.data, file)
        onChange?.(file)
    }).catch(err => {
        updateFileList(uploadFile, { status: 'error', error: err})

        onError?.(err, file)
        onChange?.(file)
    })
  }

  return (
    <div className="upload-component">
        <div 
            className="upload-input"
            onClick={handleClick}
        >
            {
                drag ? <Dragger onFile={(files) => {uploadFiles(files)}}>
                        {children}
                    </Dragger>
                    : children
            }
            <input
                className="upload-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
            />
        </div>

        <UploadList
            fileList={fileList}
            onRemove={handleRemove}
        />
    </div>
  )
}

export default Upload;
