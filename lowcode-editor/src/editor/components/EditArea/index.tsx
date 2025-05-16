import React, { MouseEventHandler, useEffect, useState } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components"
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask";

export function EditArea() {
    const { components, curComponentId, setCurComponentId} = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();
    const [firstRender, setFirstRender] = useState(true);


    // 加一个渲染延迟，防止首次渲染的时候因为没有挂载dom，但是由于初始化全局Store中已经存在缓存的componentId ，然后SelectedMask和HoverMask会提前渲染
    // 导致内部createPortal的第二个参数没有真正的dom元素，所以报错的问题
    useEffect(() => {
        if (firstRender) {
            setTimeout(() => {
                setFirstRender(false);
            }, 1000);
            return;
        }
    }, [])

    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            const config = componentConfig?.[component.name]

            // 开发环境渲染的组件和生产环境渲染的组件不一样
            if (!config?.dev) {
                return null;
            }
            
            return React.createElement(
                config.dev,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: component.styles,
                    ...config.defaultProps,
                    ...component.props,
                },
                renderComponents(component.children || [])
            )
        })
    }

    const [hoverComponentId, setHoverComponentId] = useState<number>();

    const handleMouseOver: MouseEventHandler = (e)  => {
        const path = e.nativeEvent.composedPath();

        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement;

            const componentId = ele.dataset?.componentId;
            if (componentId) {
                setHoverComponentId(+componentId);
                return;
            }
        }
    }
  
    const handleClick: MouseEventHandler = (e) => {
        const path = e.nativeEvent.composedPath(); // 类似vue router中的matched

        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement;

            const componentId = ele.dataset?.componentId;
            if (componentId) {
                setCurComponentId(+componentId);
                return;
            }
        }
    }

    return <div className="h-[100%] edit-area" onMouseOver={handleMouseOver} onMouseLeave={() => {
        setHoverComponentId(undefined);
    }} onClick={handleClick}>
        {renderComponents(components)}
        {/* 单独维护两个定位块 */}
        {hoverComponentId && hoverComponentId !== curComponentId && !firstRender && (
            <HoverMask
                portalWrapperClassName='portal-wrapper'
                containerClassName='edit-area'
                componentId={hoverComponentId}
            />
        )}
        {curComponentId && !firstRender && (
            <SelectedMask
                portalWrapperClassName='portal-wrapper'
                containerClassName='edit-area'
                componentId={curComponentId}
            />
        )}
        <div className="portal-wrapper"></div>
    </div>
}