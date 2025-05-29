import type { Meta, StoryObj } from "@storybook/react";
import { Icon, IconProps } from "./index";
import { createIcon } from './createIcon';
import Icons from './icons';
import { createFromIconfont } from './createFrontIconfont';

const meta = {
  title: "wusj-components/Icon 图标组件",
  component: Icon,
  parameters: {
    layout: "centered",
    // layout: 'fullscreen'
    docs: {
      description: {
        component: `

 \`svg\` \`自定义icon\` \`icon样式调整\` \`内置icon\` \`支持iconfont载入\` \`支持ref引用\`

## Example Usage

\`\`\`jsx
import Icons from 'wusj-components';

function App() {
  return (
    <>
      <Icons.IconAdd></Icons.IconAdd>
      <Icons.IconEmail></Icons.IconEmail>
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
    size: {
      control: {
        type: 'text',
      },
    },
  }
} satisfies Meta<IconProps>;


export default meta;

type Story = StoryObj<typeof meta>;

/**自定义icon */
export const CustomIcon: Story = {
  render: (args: IconProps) => {
    const IconAdd = createIcon({
      // 创建icon-初始预设值
      content: (
        <>
          <path d="M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"></path>
        </>
      ),
    });
    return (
      <>
        <IconAdd {...args}/>
      </>
    );
  },
};

/**使用组件库中预设icon */
export const useIcons: Story = {
  render: () => {
    return (
      <>
        <Icons.IconAdd></Icons.IconAdd>
        <Icons.IconEmail></Icons.IconEmail>
      </>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `
import Icons from 'wusj-components';

function App() {
  return (
    <>
      <Icons.IconAdd></Icons.IconAdd>
      <Icons.IconEmail></Icons.IconEmail>
    </>
  )
}
        `,
        language: "jsx",
        type: "auto",
      }
    }
  }
};

/**给icon设置样式 */
export const IconStyle: Story = {
  render: () => {
    return (
      <>
        <Icons.IconEmail style={{color: 'blue', fontSize: '50px'}}></Icons.IconEmail>
        <Icons.IconEmail spin></Icons.IconEmail>
      </>
    )
  }
}

/**远程图标库（iconfont）加载icon */
export const RemoteIcon: Story = {
  render: () => {
    const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js');
    return (
      <>
        <IconFont type="icon-shouye-zhihui" size="40px"></IconFont>
        <IconFont type="icon-gerenzhongxin-zhihui" fill="blue" size="40px"></IconFont>
      </>
    )
  }
}
