import type { Meta, StoryObj } from "@storybook/react";
import Form, { FormInterface } from "./index";
import { FormRefApi } from "./Form";
import { Button, Checkbox, Input } from "antd";
import { useRef } from "react";

const meta = {
  title: "wusj-components/Form 表单组件",
  component: Form,
  parameters: {
    layout: "centered",
    // layout: 'fullscreen'
    docs: {
      description: {
        component: `

 \`Form\` \`FormItem\` \`自定义表单校验规则\` \`表单全局状态同步更新\` \`表单项局部rerender\`

## Example Usage

\`\`\`jsx
import { Form, FormRefApi } from 'wusj-components';

function App() {
  const form = useRef<FormRefApi>(null);
  return (
     <Form
      ref={form}
      initialValues={{ username: 'wusj' }}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: '请输入用户名!' },
          { max: 6, message: '长度不能大于 6' }
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
\`\`\`
`,
      },
      source: {
        type: "code", // 可以是 'code', 'dynamic', 'auto'
      },
    },
  },
  tags: ["autodocs"],
  argTypes: { // 参数类型（如不自动识别，可自定义，也可当作补充）
    children: {
      control: false
    },

    /**Form.Item */
    label: {
      control: false,
      description: '表单项的标签',
      table: {
        type: { summary: 'ReactNode' },
        category: 'FormItem',
      }
    },
    name: {
      control: false,
      description: '表单项的名称，用于后续收集提交的key',
      table: {
        type: { summary: 'string' },
        category: 'FormItem',
      }
    },
    valuePropName: {
      control: false,
      description: '表单项的值的属性名（如value/checked）',
      table: {
        type: { summary: 'string' },
        category: 'FormItem',
        defaultValue: { summary: 'value' },
      }
    },
    rules: {
      control: false,
      description: '表单项的验证规则，参考async-validator的规则',
      table: {
        category: 'FormItem',
        type: { summary: 'Array<Record<string, any>>' },
      }
    }
  }
} satisfies Meta<any>;


export default meta;

type Story = StoryObj<typeof meta>;

const renderForm = (args: any) => {
  const onFinish = (values: any) => {
    alert('Success:' + JSON.stringify(values));
  };

  const onFinishFailed = (errorInfo: any) => {
    alert('Failed:' + JSON.stringify(errorInfo));
  };
  const form = useRef<FormRefApi>(null);

  return (
    <>
      <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
        alert(JSON.stringify(form.current?.getFieldsValue())) // 全局表单Store中所有表单项的值
      }}>打印表单值</Button>

      <Button type="primary" onClick={() => {
        form.current?.setFieldsValue({ // 设置表单值，会触发Form组件的rerender
          username: 'jammes'
        })
      }}>设置表单值</Button>

      <Form
        ref={form}
        initialValues={{ remember: true, username: 'wusj' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: '请输入用户名!' },
            { max: 6, message: '长度不能大于 6' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item>
          <div>
            <Button type="primary" htmlType="submit" >
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export const Common: Story = {
  render: renderForm,
};
