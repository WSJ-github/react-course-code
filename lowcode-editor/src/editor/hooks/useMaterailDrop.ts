import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponetsStore } from "../stores/components";

export interface ItemType {
  type: string;
  dragType?: 'move' | 'add',
  id: number
}

export function useMaterailDrop(accept: string[], id: number) {
    const { addComponent, deleteComponent, components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop(() => ({
        accept,
        drop: (item: ItemType, monitor) => {
          // 防止重复drop动作触发，比如父组件和其子组件都能drop，如果东西drop到了子组件drop，父组件也会drop
            const didDrop = monitor.didDrop()
            if (didDrop) {
              return;
            }

            // 画布内组件内拖拽移动的行为
            if(item.dragType === 'move') {
              const component = getComponentById(item.id, components)!;

              deleteComponent(item.id);

              addComponent(component, id)
            } else { // 新组件拖拽到画布的行为
              const config = componentConfig[item.type];

              addComponent({
                id: new Date().getTime(),
                name: item.type,
                desc: config.desc,
                props: config.defaultProps
              }, id)
            }
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(), // 暴露是否正在拖拽状态
        }),
    }));

    return { canDrop, drop }
}
