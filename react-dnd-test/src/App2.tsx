import { useCallback, useEffect, useRef, useState } from "react";
import './App2.css';
import { useDrag, useDrop } from "react-dnd";

interface CardItem {
    id: number;
    content: string;
}

interface CardProps {
    data: CardItem;
    index: number;
    swapIndex: Function;
}

interface DragData {
    id: number;
    index: number;
}

// 每一个Card既是可拖拽的元素，又是可放置的元素
function Card(props: CardProps) {
    const { data, swapIndex, index } = props;

    const ref = useRef(null);

    const [{ dragging }, drag] = useDrag({
        // 这坨配置对象会被useCallback包裹，useDrag的第二个参数是该useCallback的依赖，然而这里没传，说明这坨对象不会被重新创建
        type: 'card',
        item: {
            id: data.id,
            index: index
        },
        collect(monitor) {
            return {
                dragging: monitor.isDragging()
            }
        }
    });
    const [, drop] = useDrop({
        accept: 'card',
        hover(item: DragData) {
            swapIndex(index, item.index);
            // TODO:！！！
            // 因为swapIndex之后元素调整位置了，当然元素因为key没变，所以react会复用之前的dom节点
            // 这里index是闭包收集的组件渲染函数的index，每次都和当前元素所在位置一致
            // 而item.index对应上面useDrag的item.index，不会被更新，所以这里手动刷新
            // 不然会出现第一个元素移动到第二个元素上时，index变为1，item.index还是0，导致频繁对调位置
            item.index = index;
        }
        // drop(item: DragData) {
        //     swapIndex(index, item.index)
        // }
    });

    useEffect(() => {
        drag(ref);
        drop(ref);
    }, []);

    return <div ref={ref} className={ dragging ? 'card dragging' : 'card'}>{data.content}</div>
}

function App() {
    const [cardList, setCardList] = useState<CardItem[]>([
        {
            id:0,
            content: '000',
        },
        {
            id:1,
            content: '111',
        },
        {
            id:2,
            content: '222',
        },
        {
            id:3,
            content: '333',
        },
        {
            id:4,
            content: '444',
        }
    ]);

    const swapIndex = useCallback((index1: number, index2: number) => {
        const tmp = cardList[index1];
        cardList[index1] = cardList[index2];
        cardList[index2] = tmp;

        setCardList([...cardList]);
    }, [])

    return <div className="card-list">
        {
            cardList.map((item: CardItem, index) => (
                <Card data={item} key={'card_' + item.id} index={index} swapIndex={swapIndex}/>
            ))
        }
    </div>
}

export default App;

