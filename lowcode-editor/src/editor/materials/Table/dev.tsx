import { Table as AntdTable } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { useDrag } from 'react-dnd';

function Table({ id, name, children, styles }: CommonComponentProps) {

    const {canDrop, drop } = useMaterailDrop(['TableColumn'], id);
    
    const divRef = useRef<HTMLDivElement>(null);

    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        drop(divRef);
        drag(divRef);
    }, []);

    const columns = useMemo(() => {
        // TODO:
        // children在这里指的是vdom，因为当前组件函数执行过程中只创建了当前组件的fiber节点，而children vdom被传进来等待渲染
        // 但是这里只是从vdom里过滤出children中的属性，所以table item是个空节点就好了
        return React.Children.map(children, (item: any) => {
            return {
                title: <div className='m-[-16px] p-[16px]' data-component-id={item.props?.id}>{item.props?.title}</div>,
                dataIndex: item.props?.dataIndex,
                key: item // 没什么作用，设置了dataIndex后，key无所谓了
            }
        })
    }, [children]);

    return (
        <div
            className={`w-[100%] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
            ref={divRef}
            data-component-id={id}
            style={styles}
        >
            <AntdTable
                columns={columns}
                dataSource={[]}
                pagination={false}
            />
        </div>
    );
}

export default Table;