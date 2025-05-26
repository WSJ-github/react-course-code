import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta = {
  title: '光光光/Button',
  component: Button,
  parameters: {
    layout: 'centered', // 居中布局
    backgrounds: { // 背景可选
      values: [
        { name: '红红红', value: '#f00' },
        { name: '蓝', value: 'blue' },
      ],
    },
  },
  tags: ['autodocs'], // 自动生成文档
  argTypes: {
    backgroundColor: { control: 'text' }, // backgroundColor参数类型控制
  },
  // 所以 satisfies 的独特价值在于：
  // 验证类型的同时保留最具体的类型信息
  // 能够获得更精确的类型检查和代码提示
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button111',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
// 通过观察发现，这里的每一个story都会被渲染后打包成同一个静态html文件（iframe.html），然后通过iframe嵌入当前开发环境
// 静态html文件的url类似：http://localhost:6006/iframe.html?viewMode=story&id=光光光-button--guang
// 然后story是根据query参数动态渲染的
export const Guang: Story = {
  args: {
    label: '光光光',
    size: 'large',
    backgroundColor: 'green'
  },
  render(args, meta) {
    /**
     * meta.loaded: {
     *   data: [444, 555, 666],
     *   list: [111, 222, 333]
     * }
     */
    const list = meta.loaded.list;

    return <div>
      <div>{list.join(',')}</div>
      <Button {...args}/>
    </div>
  },
  loaders: [
    async () => {
      await '假装 fetch1'
      return {
        list: [
          111,
          222,
          333
        ]
      }
    },
    async () => {
      await '假装 fetch2'
      return {
        data: [
          444,
          555,
          666
        ]
      }
    },
  ],
  play: async ({ canvasElement }) => { // canvasElement是当前story展示区域的外层dom div
    const canvas = within(canvasElement); // 暴露出很多检索dom元素的方法集
    const btn = await canvas.getByRole('button', { // 通过其中的getByRole方法获取到匹配的dom元素（即btn）
      name: /光光光/i,
    });
    await userEvent.click(btn); // 内部应该是通过dispatchEvent自动触发一个点击事件（userEvent可以模拟用户的行为，比如有延迟过渡的用户输入表单等行为）
    btn.textContent = '东';

    await expect(btn.textContent).toEqual('光光光'); // 单测

    // await expect(btn.style.backgroundColor).toEqual('blue');
  },
}

