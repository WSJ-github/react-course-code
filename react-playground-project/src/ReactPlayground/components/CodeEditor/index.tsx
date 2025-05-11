import { useContext } from "react";
import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "../../PlaygroundContext";
import { debounce } from 'lodash-es';

export default function CodeEditor() {

    const { 
        theme,
        files, 
        setFiles, 
        selectedFileName, 
        setSelectedFileName
    } = useContext(PlaygroundContext)

    const file = files[selectedFileName];

    /**
     * 代码编辑器内容变化
     * @param value  当前selectedFileName对应的文件内容
     */
    function onEditorChange(value?: string) {
        console.log('onEditorChange 触发！')
        files[file.name].value = value!
        setFiles({ ...files })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 文件名列表 */}
            <FileNameList/>
            {/* 实际代码编辑器 */}
            {/* TODO: 防抖的效果：是达到了防抖效果，但是其实每次触发了之后都会rerender当前组件，所以每次debounce(onEditorChange, 500)都会返回一个新函数，不过性能应该消耗不大 */}
            {/* 第一次并不会立即执行 */}
            <Editor file={file} onChange={debounce(onEditorChange, 500)} options={{
                theme: `vs-${theme}` // 编辑器主题色会跟着变化，monaco-editor自带主题切换
            }}/>
        </div>
    )
}
