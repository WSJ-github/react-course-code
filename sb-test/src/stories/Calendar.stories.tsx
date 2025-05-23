import type { Meta, StoryObj } from '@storybook/react';
import Calendar, { CalendarProps } from '../Calendar/index';
import dayjs from 'dayjs';

const meta = {
    title: '日历组件',
    component: Calendar,
    parameters: {
        layout: 'centered'
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
export const Value: Story = { // 可控mode
    args: {
        value: dayjs('2023-11-08')
    },
    render: renderCalendar
};

export const defaultValue: Story = { // 非可控mode
    args: {
        defaultValue: dayjs('2023-11-08')
    },
    render: renderCalendar
};

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

export const Locale: Story = {
    args: {
        value: dayjs('2023-11-08'),
        locale: 'en-US'
    },
    render: renderCalendar
};
