import { Form, Input, InputNumber, Select } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import { ComponentSetter, useComponentConfigStore } from '../../stores/component-config';
import { useComponetsStore } from '../../stores/components';
import CssEditor from './CssEditor';
import { debounce } from 'lodash-es';
import styleToObject from 'style-to-object';

export function ComponentStyle() {

  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentStyles } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();
  const [css, setCss] = useState<string>(`.comp{\n\n}`); // 初始化【样式编辑框】里的内容

  useEffect(() => {
    form.resetFields(); // 重置表单，因为表单并没有传默认初始值，所以应该是会重置为空对象

    const data = form.getFieldsValue();
    form.setFieldsValue({...data, ...curComponent?.styles});

    setCss(toCSSStr(curComponent?.styles!))
  }, [curComponent])

  // 将css对象转换为css字符串，并且个别属性会自动添加px单位
  function toCSSStr(css: Record<string, any>) {
    // 即使传入的css是undefined，但是用for循环的的时候还是不会报错的（亲测）
    let str = `.comp {\n`;
    for(let key in css) {
        let value = css[key];
        if(!value) {
            continue;
        }
        if(['width', 'height'].includes(key) &&  !value.toString().endsWith('px')) {
            value += 'px';
        }

        str += `\t${key}: ${value};\n`
    }
    str += `}`;
    return str;
  }

  if (!curComponentId || !curComponent) return null;

  function renderFormElememt(setting: ComponentSetter) {
    const { type, options } = setting;
  
    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'input') {
      return <Input />
    } else if (type === 'inputNumber') {
        return <InputNumber />
    }
  }

  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
        updateComponentStyles(curComponentId, changeValues);
    }
  }

  // 【样式编辑框】内容变更 处理
  const handleEditorChange = debounce((value) => {
    setCss(value);

    let css: Record<string, any> = {};

    try {
        const cssStr = value.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
            .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
            .replace('}', '');// 去掉 }
        
        // 将css字符串转换为对象 (因为要存)
        // 顺便将css字符串中的 - 转换为驼峰
        styleToObject(cssStr, (name, value) => {
            css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
        });
        
        updateComponentStyles(curComponentId, {...form.getFieldsValue(), ...css}, true); // 样式属性直接【替换】
    } catch(e) {}
  }, 500);

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {
        componentConfig[curComponent.name]?.stylesSetter?.map(setter => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElememt(setter)}
          </Form.Item>
        ))
      }
      <div className='h-[200px] border-[1px] border-[#ccc] z-10'>
        <CssEditor value={ css } onChange={handleEditorChange}/>
      </div>
    </Form>
  )
}