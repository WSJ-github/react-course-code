import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from '../../stores/component-config';
import { useComponetsStore } from '../../stores/components';

export function ComponentAttr() {

  const [form] = Form.useForm(); // 默认context暴露出来的是空对象

  const { curComponentId, curComponent, updateComponentProps } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();
    // 用当前组件的props去设置全局表单状态
    // 全局表单状态值变更 -> 触发FormItem内部的effect执行，比如当前FormItem状态值（即内部维护的state与全局状态对应字段同步）
    form.setFieldsValue({...data, ...curComponent?.props});
  }, [curComponent]) // 注意这里是 curComponent变更才会重新触发

  if (!curComponentId || !curComponent) return null;
  
  function renderFormElememt(setting: ComponentSetter) {
    const { type, options } = setting;
  
    // 这里可以后面再扩展，比如支持inputNumber、colorPicker、datePicker等
    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'input') {
      return <Input />
    }
  }

  function valueChange(changeValues: ComponentConfig) {
    // TODO:
    // 哪个FormItem发生变更就会是哪个值，比如changeValues = {name: 'text', value: '按钮123'}
    // FormItem内部发生change的时候应该会触发 全局Form状态同步 & 自己内部State变更 & valueChange方法
    // 而这个全局Form状态同步操作：只是修改了全局暴露状态对象的对应属性，并没有用setState的形式，所以不会触发全局表单刷新
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues); // 更新对应组件的props
    }
  }

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {/* FormItem 没传name会直接渲染children，跟Form全局状态没有关联 */}
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled/>
      </Form.Item>
      {
        componentConfig[curComponent.name]?.setter?.map(setter => (
          // FormItem 设置了name之后，会与Form全局状态关联，具体可以参考FormItem实现项目
          // 会用React.cloneElement去对children进行包装，比如传入value & onChange
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElememt(setter)}
          </Form.Item>
        ))
      }
    </Form>
  )
}