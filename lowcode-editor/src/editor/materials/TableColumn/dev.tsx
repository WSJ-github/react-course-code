// 傀儡节点，不需要实际渲染的，只要作为组件存在即可，后续转为vdom传入父组件，即table组件内部会被过滤提取有用的prop属性来做最终渲染
// FormItem组件也是同理 ！！！
const TableColumn = () => {
    return <></>
}

export default TableColumn;