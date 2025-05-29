import type { Meta, StoryObj } from "@storybook/react";
import Watermark, { WatermarkProps } from "./index";
import { defaultOptions } from "./useWatermark";

const meta = {
  title: "wusj-components/Watermark 水印组件",
  component: Watermark,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`支持text水印\` \`支持image水印\` \`基于canvas绘制\` \`防删除检测（基于mutationObserver）\` 

## Example Usage

\`\`\`jsx
import { Watermark } from 'wusj-components';

function App() {
  return (
    <Watermark>
      <div style={{ height: 600 }}>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
          deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
          recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
          id provident!
        </p>
      </div>
    </Watermark>
  );
}
\`\`\`
`
      }
    }
    // layout: 'fullscreen'
  },
  tags: ["autodocs"],
	args: { // 实例默认参数
		content: ["wusj-components", "测试水印"]
  },
  argTypes: {
    zIndex: {
      control: "number",
      // description: "水印的层级",
      table: {
        type: { summary: "string | number" },
        defaultValue: { summary: "-1" },
      },
    },
    // // 文字样式配置
    // fontStyle: {
    //   description: '文字样式配置',
    //   control: 'object',
    //   table: {
    //     type: { summary: "{ color, fontFamily, fontSize, fontWeight }" },
    //     // defaultValue: {
    //     //   summary: "{ color: 'rgba(0,0,0,0.15)', fontSize: 16, fontWeight: 'normal' }",
    //     // },
    //   },
    // },
    content: {
      description: '水印的文字内容（tip: 通过换行可以分隔多行）',
      control: 'text',
      table: {
        type: { summary: 'string | string[]' },
      }
    },
    width: {
      description: '单个水印的宽度',
      control: { type: 'number', min: 20, max: 500 },
      table: {
        type: { summary: 'number' },
      }
    },
    height: {
      description: '单个水印的高度',
      control: { type: 'number', min: 20, max: 500 },
      table: {
        type: { summary: 'number' },
      }
    },
    rotate: {
      description: '水印旋转角度（度数）',
      control: { type: 'range', min: -180, max: 180, step: 1 },
      table: {
        type: { summary: 'number' },
      }
    },
    gap: {
      description: '水印之间的间距 [水平间距, 垂直间距]',
      control: 'object',
      table: {
        type: { summary: '[number, number]' },
      }
    },
    offset: {
      description: '水印偏移量 [水平偏移, 垂直偏移]',
      control: 'object',
      table: {
        type: { summary: '[number, number]' },
      }
    },

		/*** fontStyle类目相关 */
		fontStyle: {
			control: false, // 禁用整体对象的控制
			table: {
        disable: true,
      }
		},
		// 实际功能是有效的，只是类型判断出问题，暂时忽略
		// @ts-ignore
		fontColor: {
			name: 'color',
			control: { type: 'color' },
			description: '水印文字颜色',
			table: {
				category: 'FontStyle', // 类目
				type: { summary: 'string' },
			},
		},
		fontSize: {
			name: 'size',
			control: { type: 'number', min: 8, max: 72 },
			description: '水印文字大小',
			table: {
				category: 'FontStyle', // 类目
				type: { summary: 'number | string' },
			},
		},
		fontWeight: {
      name: '文字粗细',
      control: 'select',
			options: ['normal', 'bold', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
      description: '文字粗细',
      table: {
        category: 'FontStyle', // 类目
				type: { summary: 'string' },
      }
    },
  }
} satisfies Meta<typeof Watermark>;

Object.entries(meta.argTypes).forEach(([key, obj]) => {
	// @ts-ignore
  if(!obj?.table?.defaultValue && defaultOptions[key]) {
		// @ts-ignore
		obj.table.defaultValue = { summary: JSON.stringify(defaultOptions[key]) };
	}
});

console.log('meta.argTypes', meta.argTypes);

export default meta;

type Story = StoryObj<typeof meta>;

const renderWatermark = (args: any) => {
	// 提取自定义控件参数
  let { fontColor, fontSize, fontWeight, content,...otherArgs } = args;

	if (content.includes('\n')) {
    content = content.split('\n');
  }

	// TODO: 构建真正的fontStyle对象
	// 可能通过Story配置的默认参数传入，也可能通过自定义控件区域设置的属性传入
  const fontStyle = otherArgs.fontStyle || {
    color: fontColor, // 即使undefined也没事，组件内部会合并有默认值
    fontSize: fontSize,
    fontWeight: fontWeight,
  };
	console.log('fontStyle', fontStyle);
  return (
    <Watermark {...otherArgs} fontStyle={fontStyle} content={content}>
      <div style={{ height: 600 }}>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
          deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
          recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
          id provident!
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
          deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
          recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
          id provident!
        </p>
      </div>
    </Watermark>
  );
};

export const Common: Story = {
  // args: {
  //   content: ["wusj-components", "测试水印"],
  // },
  render: renderWatermark,
};
