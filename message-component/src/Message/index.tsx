import { CSSProperties, FC, MutableRefObject, ReactNode, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import useStore, { MessageList } from "./useStore";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import './index.scss';
import { createPortal } from "react-dom";
import { useTimer } from "./useTimer";

export type Position = 'top' | 'bottom';

export interface MessageProps {
    style?: CSSProperties;
    className?: string | string[];
    content: ReactNode | string;
    duration?: number;
    onClose?: (...args: any) => void;
    id?: number;
    position?: Position;
}

const MessageItem:FC<MessageProps> = (item) => {
    // 控制默认消息item的显示和隐藏
    const {onMouseEnter, onMouseLeave} = useTimer({
        id: item.id!,
        duration: item.duration,
        remove: item.onClose!,
    });

    return <div className="message-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {item.content}
    </div>
}

export interface MessageRef {
    add: (messageProps: MessageProps) => number;
    remove: (id: number) => void;
    update: (id: number, messageProps: MessageProps) => void;
    clearAll: () => void;
}

export const MessageProvider = forwardRef<MessageRef, {}>((props, ref) => {

    // 维护一个消息列表state，返回该列表已经所有增删改操作的api
    const { messageList, add, update, remove, clearAll } = useStore('top');

    // 因为useImperativeHandle不是同步的，为了保证ref能及时拿到
    if('current' in ref!) {
        ref.current = {
            add,
            update,
            remove,
            clearAll
        }
    }
    // useImperativeHandle(ref, () => {
    //     return {
    //         add,
    //         update,
    //         remove,
    //         clearAll
    //     }
    // }, [])

    const positions = Object.keys(messageList) as Position[];

    const messageWrapper = <div className="message-wrapper">
        {
            positions.map(direction => {
                return <div className={`message-wrapper-${direction}`} key={direction}>
                    <TransitionGroup>
                        {
                            messageList[direction].map(item => {
                                // timeout 属性在 React 的 CSSTransition 组件中具有以下作用：
                                // 定义过渡动画的持续时间：它指定了过渡动画的总时长，单位为毫秒。
                                // 控制类名应用时间：决定了各个过渡阶段（进入和退出）的类名应用多长时间。
                                return  <CSSTransition key={item.id} timeout={1000} classNames='message'>
                                    <MessageItem onClose={remove} {...item}></MessageItem>
                                </CSSTransition>
                            })
                        }
                    </TransitionGroup>
                </div>
            })
        }
    </div>

    const el = useMemo(() => {
        const el = document.createElement('div');
        el.className = `wrapper`;

        document.body.appendChild(el);
        return el;
    }, []);

    return createPortal(messageWrapper, el);
})