import type { Meta, StoryObj } from "@storybook/react";
import Space, { SpaceProps } from '.';
import { ConfigProvider as SpaceConfigProvider } from './ConfigProvider';

const meta = {
  title: "wusj-components/Space 间距组件",
  component: Space,
  parameters: {
    layout: "centered",
    // layout: 'fullscreen'
    docs: {
      description: {
        component: `

 \`基于flex布局\` \`支持全局配置\`

## Example Usage

\`\`\`jsx
import Space from 'wusj-components';

function App() {
  return (
    <>
      <Space direction="horizontal" wrap={true}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </>
  )
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
      control: false,
      table: {
        type: {
          summary: 'ReactNode',
        },
      },
    },
    size: {
      control: {
        type: 'radio',
      },
      table: {
        type: {
          summary: 'small | middle | large | number | undefined',
        },
        defaultValue: {
          summary: 'small',
        },
      },
      options: ['small', 'middle', 'large'],

    },
    split: {
      control: false,
      table: {
        type: {
          summary: 'ReactNode',
        },
      },
    }
  }
} satisfies Meta<SpaceProps>;


export default meta;

type Story = StoryObj<typeof meta>;

export const common: Story = {
  args: {
    children: (
      [
        <div className="box"></div>,
        <div className="box"></div>,
        <div className="box"></div>,
        <div className="box"></div>,
      ]
    ),
    // wrap: false,
  },
};

/**Provider全局配置注入*/
export const Provider: Story = {
  render: (args: SpaceProps) => {
    return <div>
    <SpaceConfigProvider space={{ size: 50 }}>
      <Space {...args}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </SpaceConfigProvider>
  </div>
  },
};

/** 分割线 */
export const Split: Story = {
  args: {
    split: '【线】',
    children: (
      [
        <div className="box"></div>,
        <div className="box"></div>,
        <div className="box"></div>,
        <div className="box"></div>,
      ]
    ),
  },
};
