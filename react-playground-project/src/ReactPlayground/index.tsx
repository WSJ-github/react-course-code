import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundContext";

import './index.scss';

export default function ReactPlayground() {

    const { 
        theme, 
        setTheme, 
    } = useContext(PlaygroundContext)

    return <div 
        className={theme}
        style={{height: '100vh'}}
    >
        <Header/>
        {/* defaultSizes={[100, 100]} 左右两侧比值大小，说明设置为同等比例 */}
        <Allotment defaultSizes={[100, 100]}>
            {/* minSize={0} 拖拽最小宽度为0 */}
            <Allotment.Pane minSize={0}>
                {/* 代码编辑器区域 */}
                <CodeEditor />
            </Allotment.Pane>
            <Allotment.Pane minSize={0}>
                {/* 预览区域 */}
                <Preview />
            </Allotment.Pane>
        </Allotment>
    </div>
}