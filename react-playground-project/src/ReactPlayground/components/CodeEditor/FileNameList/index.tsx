import { useContext, useEffect, useState } from "react"
import { PlaygroundContext } from "../../../PlaygroundContext"

import { FileNameItem } from "./FileNameItem"
import styles from './index.module.scss'
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from "../../../files"

export default function FileNameList() {
    const { 
        files, 
        removeFile, 
        addFile, 
        updateFileName, 
        selectedFileName,
        setSelectedFileName
    } = useContext(PlaygroundContext)

    const [tabs, setTabs] = useState([''])

    useEffect(() => {
        setTabs(Object.keys(files))
    }, [files])

    const handleEditComplete = (name: string, prevName: string) => {
        updateFileName(prevName, name);
        setSelectedFileName(name);

        setCreating(false);
    }

    const [creating, setCreating] = useState(false); // 是否正在创建文件

    const addTab = () => {
        const newFileName = 'Comp' + Math.random().toString().slice(2,6) + '.tsx';
        addFile(newFileName);
        setSelectedFileName(newFileName);
        setCreating(true)
    }

    const handleRemove = (name: string) => {
        removeFile(name)
        setSelectedFileName(ENTRY_FILE_NAME)
    }

    const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME]; // 只读文件名

    return <div className={styles.tabs}>
        {
            tabs.map((item, index, arr) => (
                <FileNameItem 
                    key={item + index}  
                    value={item} // 文件名
                    readonly={readonlyFileNames.includes(item)} // 是否只读
                    creating={creating && index === arr.length - 1} // 是否正在创建文件
                    actived={selectedFileName === item} // 是否选中
                    onClick={() => setSelectedFileName(item)} // 点击文件名
                    onEditComplete={(name: string) => handleEditComplete(name, item)} // 编辑完成
                    onRemove={() => handleRemove(item)} // 删除文件
                >
                </FileNameItem>
            ))
        }
        <div className={styles.add} onClick={addTab}>
            +
        </div>
    </div>
}