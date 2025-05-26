import type { Meta, StoryObj } from "@storybook/react";
import { ConfigProvider } from "./ConfigProvider";
import { useMessage } from "./useMessage";
import { Button } from "antd";
import { useRef } from "react";

const meta = {
  title: "wusj-components/Message 全局提示",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
全局消息提示组件，用于展示操作反馈、通知等临时性信息。

## 使用方法

1. 在应用最外层包裹 ConfigProvider
2. 在组件内通过 useMessage hook 获取消息控制器
3. 调用 message.add() 方法显示消息

\`\`\`jsx
// 在应用根组件
import { ConfigProvider } from './Message/ConfigProvider';

function App() {
  return (
    <ConfigProvider>
      <YourApp />
    </ConfigProvider>
  );
}

// 在任意组件内
import { useMessage } from './Message/useMessage';

function YourComponent() {
  const message = useMessage();
  
  const showMessage = () => {
    message.add({ content: '操作成功!' });
  };
  
  return <button onClick={showMessage}>显示消息</button>;
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
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// 基本用法
export const Basic: Story = {
  render: () => {
    const ButtonList = () => {
      const message = useMessage();
      return (
        <div style={{ padding: "20px" }}>
          <Button
            onClick={() => message.add({ content: "这是一条普通消息" })}
            style={{ marginRight: "10px" }}
          >
            显示普通消息
          </Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <ButtonList />
      </ConfigProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
() => {
    const ButtonList = () => {
      const message = useMessage();
      return (
        <div style={{ padding: "20px" }}>
            <Button
            onClick={() => message.add({ content: "这是一条普通消息" })}
            style={{ marginRight: "10px" }}
            >
            显示普通消息
            </Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <ButtonList />
      </ConfigProvider>
    );
}
`,
        language: "jsx",
        type: "auto",
      },
    },
  },
};

// 消息位置
export const MessagePosition: Story = {
  render: () => {
    const Demo = () => {
      const message = useMessage();

      return (
        <div style={{ padding: "20px" }}>
          <Button
            onClick={() =>
              message.add({
                content: "顶部消息",
                position: "top",
                duration: 3000,
              })
            }
            style={{ marginRight: "10px" }}
          >
            顶部消息
          </Button>

          <Button
            onClick={() =>
              message.add({
                content: "底部消息",
                position: "bottom",
                duration: 3000,
              })
            }
          >
            底部消息
          </Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <Demo />
      </ConfigProvider>
    );
  },
};

// 自定义持续时间
export const CustomDuration: Story = {
  render: () => {
    const Demo = () => {
      const message = useMessage();

      return (
        <div style={{ padding: "20px" }}>
          <Button
            onClick={() =>
              message.add({
                content: "短暂消息 (1秒)",
                duration: 1000,
              })
            }
            style={{ marginRight: "10px" }}
          >
            短暂消息 (1秒)
          </Button>

          <Button
            onClick={() =>
              message.add({
                content: "标准消息 (3秒)",
                duration: 3000,
              })
            }
            style={{ marginRight: "10px" }}
          >
            标准消息 (3秒)
          </Button>

          <Button
            onClick={() =>
              message.add({
                content: "持久消息 (不会自动关闭)",
                duration: 0,
              })
            }
          >
            持久消息 (不会自动关闭)
          </Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <Demo />
      </ConfigProvider>
    );
  },
};

// 自定义样式
export const CustomStyle: Story = {
  render: () => {
    const Demo = () => {
      const message = useMessage();

      return (
        <div style={{ padding: "20px" }}>
          <Button
            onClick={() =>
              message.add({
                content: "自定义样式消息",
                style: {
                  backgroundColor: "red",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  padding: "12px 20px",
                  fontWeight: "bold",
                },
              })
            }
            style={{ marginRight: "10px" }}
          >
            自定义样式
          </Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <Demo />
      </ConfigProvider>
    );
  },
};

// 复杂内容
export const ComplexContent: Story = {
  render: () => {
    const Demo = () => {
      const message = useMessage();

      return (
        <div style={{ padding: "20px" }}>
          <Button
            onClick={() =>
              message.add({
                content: (
                  <div>
                    <h4 style={{ margin: "0 0 8px 0" }}>操作成功</h4>
                    <p style={{ margin: 0 }}>数据已成功保存到数据库</p>
                  </div>
                ),
              })
            }
            style={{ marginRight: "10px" }}
          >
            复杂内容消息
          </Button>

          <Button
            onClick={() =>
              message.add({
                content: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#52c41a",
                        marginRight: "8px",
                      }}
                    ></span>
                    成功消息带图标
                  </div>
                ),
              })
            }
          >
            带图标消息
          </Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <Demo />
      </ConfigProvider>
    );
  },
};

// 消息更新与关闭
export const UpdateAndClose: Story = {
  render: () => {
    const Demo = () => {
      const message = useMessage();
      const messageIdRef = useRef<number | null>(null);

      const showMessage = () => {
        if(messageIdRef.current) return;
        messageIdRef.current = message.add({
          content: "这条消息可以被更新或关闭",
          duration: 0,
        });
      };

      const updateMessage = () => {
        if (messageIdRef.current !== null) {
          message.update(messageIdRef.current, {
            content: "消息已更新！" + new Date().toLocaleTimeString(),
          });
        }
      };

      const closeMessage = () => {
        if (messageIdRef.current !== null) {
          message.remove(messageIdRef.current);
          messageIdRef.current = null;
        }
      };

      return (
        <div style={{ padding: "20px" }}>
          <Button onClick={showMessage} style={{ marginRight: "10px" }}>
            显示消息
          </Button>

          <Button onClick={updateMessage} style={{ marginRight: "10px" }}>
            更新消息
          </Button>

          <Button onClick={closeMessage}>关闭消息</Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <Demo />
      </ConfigProvider>
    );
  },
};

// 多条消息与清除
export const MultipleMessages: Story = {
  render: () => {
    const Demo = () => {
      const message = useMessage();

      const addMultipleMessages = () => {
        message.add({ content: "第一条消息", position: "top" });
        message.add({ content: "第二条消息", position: "top" });
        message.add({ content: "第三条消息", position: "bottom" });
      };

      return (
        <div style={{ padding: "20px" }}>
          <Button onClick={addMultipleMessages} style={{ marginRight: "10px" }}>
            添加多条消息
          </Button>

          <Button onClick={() => message.clearAll()}>清除所有消息</Button>
        </div>
      );
    };

    return (
      <ConfigProvider>
        <Demo />
      </ConfigProvider>
    );
  },
};
