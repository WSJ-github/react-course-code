import { Button, Checkbox, Input, Form as AntdForm } from "antd";
import Form from "./Form/index";
import { useEffect, useRef } from "react";
import { FormRefApi } from "./Form/Form";

const Basic: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const form = useRef<FormRefApi>(null);

  return (
    <>
      <Button type="primary" onClick={() => {
        console.log(form.current?.getFieldsValue()) // 全局表单Store中所有表单项的值
      }}>打印表单值</Button>

      <Button type="primary" onClick={() => {
        form.current?.setFieldsValue({ // 设置表单值，会触发Form组件的rerender
          username: '东东东'
        })
      }}>设置表单值</Button>

      <Form
        ref={form}
        initialValues={{ remember: true, username: '神说要有光' }}
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

const App2 = () => {
  const [form]= AntdForm.useForm();
  
  useEffect(() => {
    form.setFieldsValue({
      a: {
        b: {
          c: 'ccc'
        }
      },
      d: {
        e : 'eee'
      }
    })
  }, []);

  return (
    <AntdForm form={form}>
      <AntdForm.Item name={['d', 'e']}>
        <Input/>
      </AntdForm.Item>
    </AntdForm>
  )
}

export default Basic;
