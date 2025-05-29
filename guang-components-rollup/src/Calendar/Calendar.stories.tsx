import type { Meta, StoryObj } from '@storybook/react';
import Calendar, { CalendarProps } from './index';
import dayjs from 'dayjs';

const meta = {
    title: 'wusj-components/Calendar 日历组件',
    component: Calendar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
              component: `
\`受控&非受控\` \`自定义日期单元格\` \`国际化\` 

## Example Usage

\`\`\`jsx
import { Calendar } from 'wusj-components';

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
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'date'
        },
        defaultValue: {
            control: 'date'
        }
    },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderCalendar = (args: CalendarProps) => {
    if(typeof args.value === 'number') {
        return <Calendar {...args} value={dayjs(new Date(args.value))}/>
    }

    return <Calendar {...args}/>
}

// TODO: 对应组件的Docs默认预览用的 第一个导出的Story
/**（组件）受控模式 */
export const Value: Story = { // 可控mode
    args: {
        value: dayjs(Date.now())
    },
    render: renderCalendar
};

/**非受控模式 */
export const defaultValue: Story = { // 非可控mode
    args: {
        defaultValue: dayjs('2023-11-08')
    },
    render: renderCalendar
};

/**自定义【整个】日期单元格 */
export const DateRender: Story = {
    args: {
        value: dayjs('2023-11-08'),
        dateRender(currentDate) {
            return <div>
                日期{currentDate.date()}
            </div>
        }
    },
    render: renderCalendar
};

/**自定义日期单元格的【content】部分 */
export const DateInnerContent: Story = {
    args: {
        value: dayjs('2023-11-08'),
        dateInnerContent(currentDate) {
            return <div>
                日期{currentDate.date()}
            </div>
        }
    },
    render: renderCalendar
};

/**国际化 */
export const Locale: Story = {
    args: {
        value: dayjs('2023-11-08'),
        locale: 'en-US'
    },
    render: renderCalendar
};
