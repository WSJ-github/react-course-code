import { Collapse, Input, Select, CollapseProps, Button} from 'antd';
import { getComponentById, useComponetsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import type { ComponentEvent } from '../../stores/component-config';
import { ActionConfig, ActionModal } from './ActionModal';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export function ComponentEvent() {

    const { curComponentId, components, curComponent, updateComponentProps } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [curEvent, setCurEvent] = useState<ComponentEvent>(); // 当前正在设置的事件类型

    // 编辑相关
    const [curAction, setCurAction] = useState<ActionConfig>();
    const [curActionIndex, setCurActionIndex] = useState<number>();

    if (!curComponent) return null;

    // 删除事件动作
    function deleteAction(event: ComponentEvent, index: number) {
        if(!curComponent) {
            return;
        }

        const actions = curComponent.props[event.name]?.actions;

        actions.splice(index, 1)

        updateComponentProps(curComponent.id,  { 
            [event.name]: { 
                actions: actions
            }
        })
    }

    // 编辑事件动作
    function editAction(config: ActionConfig, index: number, event: ComponentEvent) {
        if(!curComponent) {
            return;
        }

        setCurAction(config);
        setCurActionIndex(index)
        setCurEvent(event); // fix：原项目bug ！！！如果不加的话，在触发handleModalOk的时候因为没有curEvent，所以会直接return
        setActionModalOpen(true);
    }

    // componentConfig[curComponent.name].events描述了当前组件允许设置的事件类型
    const items: CollapseProps['items'] = (componentConfig[curComponent.name].events || []).map(event => {
        return {
            key: event.name,
            label: <div className='flex justify-between leading-[30px]'>
                {event.label}
                <Button type="primary" onClick={(e) => {
                    e.stopPropagation(); // 得阻止冒泡，否则会触发Collapse面板展开收起动作

                    setCurEvent(event);
                    setActionModalOpen(true);
                }}>添加动作</Button>
            </div>,
            children: <div>
                {
                    (curComponent.props[event.name]?.actions || []).map((item: ActionConfig, index: number) => {
                        return <div>
                            {
                                item.type === 'goToLink' ? <div key="goToLink" className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                    <div className='text-[blue]'>跳转链接</div>
                                    <div>{item.url}</div>
                                    <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                                        onClick={() => editAction(item, index, event)}
                                    ><EditOutlined /></div>
                                    <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                        onClick={() => deleteAction(event, index)}
                                    ><DeleteOutlined /></div>
                                </div> : null
                            }
                            {
                                item.type === 'showMessage' ? <div key="showMessage" className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                    <div className='text-[blue]'>消息弹窗</div>
                                    <div>{item.config.type}</div>
                                    <div>{item.config.text}</div>
                                    <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                                        onClick={() => editAction(item, index, event)}
                                        ><EditOutlined /></div>
                                    <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                        onClick={() => deleteAction(event, index)}
                                    ><DeleteOutlined /></div>
                                </div> : null
                            }
                            {
                                item.type === 'customJS' ? <div key="customJS" className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                    <div className='text-[blue]'>自定义 JS</div>
                                    <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                                        onClick={() => editAction(item, index, event)}
                                    ><EditOutlined /></div>
                                    <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                        onClick={() => deleteAction(event, index)}
                                    ><DeleteOutlined /></div>
                                </div> : null
                            }
                            {
                                item.type === 'componentMethod' ? <div key="componentMethod" className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                    <div className='text-[blue]'>组件方法</div>
                                    <div>{getComponentById(item.config.componentId, components)?.desc}</div>
                                    <div>{item.config.componentId}</div>
                                    <div>{item.config.method}</div>
                                    <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                                        onClick={() => editAction(item, index, event)}
                                    ><EditOutlined /></div>
                                    <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                        onClick={() => deleteAction(event, index)}
                                    ><DeleteOutlined /></div>
                                </div> : null
                            }
                        </div>
                    })
                }
            </div>
        }
    })

    function handleModalOk(config?: ActionConfig) {
        // 知道了当前：组件id、事件类型、是否有curAciton和curActionIndex，就可以知道当前要更新还是创建哪个动作
        if(!config || !curEvent || !curComponent) {
            return ;
        }

        if(curAction) {
            updateComponentProps(curComponent.id,  { 
                [curEvent.name]: { 
                    actions: curComponent.props[curEvent.name]?.actions.map((item: ActionConfig, index: number) => {
                        return index === curActionIndex ? config : item;
                    })
                }
            })
        } else {
            updateComponentProps(curComponent.id,  { 
                [curEvent.name]: { 
                    actions: [
                        ...(curComponent.props[curEvent.name]?.actions || []),
                        config
                    ]
                }
            })
        }

        setCurAction(undefined);

        setActionModalOpen(false)
    }

    return <div className='px-[10px]'>
        {/* 设置defaultActiveKey，默认展开所有当前组件允许设置的事件 */}
        <Collapse className='mb-[10px]' items={items} defaultActiveKey={componentConfig[curComponent.name].events?.map(item =>item.name)}/>
        <ActionModal visible={actionModalOpen} handleOk={handleModalOk} action={curAction} handleCancel={() => {
            setCurAction(undefined);
            setActionModalOpen(false)
        }}/>
    </div>
}
