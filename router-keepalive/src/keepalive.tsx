import React, { createContext, useContext } from 'react';
import { useOutlet, useLocation, matchPath } from 'react-router-dom'
import type { FC, PropsWithChildren, ReactNode } from 'react';

interface KeepAliveLayoutProps extends PropsWithChildren{
    keepPaths: Array<string | RegExp>;
    keepElements?: Record<string, ReactNode>;
    dropByPath?: (path: string) => void;
}

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, 'children'>;

const keepElements: KeepAliveContextType['keepElements'] = {};

export const KeepAliveContext = createContext<KeepAliveContextType>({
    keepPaths: [], // 需要缓存的页面路径
    keepElements, // 缓存的页面元素
    dropByPath(path: string) {
        keepElements[path] = null;
    }
});

/***
 * 判断当前路径是否需要缓存(即是否在keepPaths中)
 */
const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
    let isKeep = false;
    for(let i = 0; i< keepPaths.length; i++) {
        let item = keepPaths[i];
        if (item === path) {
            isKeep = true;
        }
        if (item instanceof RegExp && item.test(path)) {
            isKeep = true;
        }
        if (typeof item === 'string' && item.toLowerCase() === path) {
            isKeep = true;
        }
    }
    return isKeep;
}

/***
 * 路由节点缓存（如果需要），返回缓存的路由节点（或者新的路由节点）
 */
export function useKeepOutlet() {
    const location = useLocation();
    const element = useOutlet(); // 返回当前路由节点（JSX.Element类型）

    const { keepElements, keepPaths } = useContext(KeepAliveContext);
    const isKeep = isKeepPath(keepPaths, location.pathname);

    if (isKeep) {
        keepElements![location.pathname] = element;
    }

    return <>
        {
            /***
             * 所有需要缓存的路由组件都会被渲染到 DOM 中
             * 通过 hidden 属性来控制显示/隐藏，而不是销毁/重建
             * 这意味着组件的状态会被保留
             * TODO:
             * 所以，虽然看起来每次都在更新 keepElements，但这不会导致组件重新创建或状态丢失，因为：
             * React 的 DOM diff 算法会复用已有的 DOM 节点
             * 组件实例会被保持，而不是重新创建
             * 通过 hidden 属性切换显示状态，而不是销毁重建
             * 
             * 补充（个人理解）：因为每次都是渲染都是相同结构的组件，所以不会重新创建组件实例（Fiber节点），即使可能重新创建，但是内部的状态在diff比对之后还是会复用之前的
             * ------------- 就好比vue中的vnode节点每次render得到新的，但是patchVnode通过之后进入prepatch时会维护当前新的一些属性，然后旧的比如实例、dom节点还是会保留
             * ------------- 所以这里用keepElements记录当前缓存的节点的构造函数（JSX.Element类型），然后通过hidden属性来控制显示/隐藏，当前如果路由不是缓存的路由，那么这些缓存的路由都只是被隐藏而已
             * ------------- 结构上还是存在的，所以Fiber树中还是有这些节点的，每次渲染完新的Fiber节点树之后，diff比对的时候状态啥的还是被复用了，因此实现了路由缓存效果
             * 可以类比常规组件流程中的某子组件更新重新执行组件渲染函数，但是如果外层结构没有变化，那么状态还是会被保留的
             */
            Object.entries(keepElements).map(([pathname, element]) => (
                <div 
                    key={pathname}
                    style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden auto' }}
                    className="keep-alive-page"
                    hidden={!matchPath(location.pathname, pathname)} // 不是当前路由的缓存节点隐藏
                >
                    {element}
                </div>
            ))
        }
        {/* 如果当前路由不需要缓存，则渲染当前路由节点 */}
        {!isKeep && element}
    </>
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
    const { keepPaths, ...other } = props;

    const { keepElements, dropByPath } = useContext(KeepAliveContext);

    return (
        // 提供上下文, keepPaths是传入的，keepElements和dropByPath用默认值中的
        // children元素也直接展开+透传
        <KeepAliveContext.Provider value={{ keepPaths, keepElements, dropByPath }} {...other} />
    )
}

export default KeepAliveLayout;
