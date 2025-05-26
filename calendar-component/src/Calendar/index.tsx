import dayjs, { Dayjs } from 'dayjs';
import MonthCalendar from './MonthCalendar';
import './index.scss';
import Header from './Header';
import { CSSProperties, ReactNode, useState } from 'react';
import cs from 'classnames';
import LocaleContext from './LocaleContext';
import { useControllableValue } from 'ahooks';

export interface CalendarProps {
    value?: Dayjs;
    defaultValue?: Dayjs;
    style?: CSSProperties;
    className?: string | string[];
    // 定制日期显示，会完全覆盖日期单元格
    dateRender?: (currentDate: Dayjs) => ReactNode;
    // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
    dateInnerContent?: (currentDate: Dayjs) => ReactNode;
    // 国际化相关
    locale?: string;
    onChange?: (date: Dayjs) => void;
}

function Calendar(props: CalendarProps) {

    const {
        value,
        style,
        className,
        locale,
        onChange
    } = props;

    // 封装支持受控&非受控模式
    // 内部会维护组件当前state和处理onChange的调用
    const [curValue, setCurValue] = useControllableValue<Dayjs>(props, {
        defaultValue: dayjs()
    });

    // 月份和当前日期状态分开维护，因为如果切换月份的话，我们是要保证当前日期不被影响的
    // 月份信息，主要是获取其中的月，然后渲染当前月的日历
    const [curMonth, setCurMonth] = useState<Dayjs>(curValue);

    const classNames = cs("calendar", className);

    function selectHandler(date: Dayjs) {
        setCurValue(date);
        setCurMonth(date);
        onChange?.(date);
    }

    function prevMonthHandler() {
        // datejs内部会自动处理月份的边界问题，比如5.31减一个月会变成4.30
        setCurMonth(curMonth.subtract(1, 'month'));
    }

    function nextMonthHandler() {
        setCurMonth(curMonth.add(1, 'month'));
    }
    
    function todayHandler() {
        const date = dayjs(Date.now());

        setCurValue(date);
        setCurMonth(date);
        onChange?.(date);
    }

    return <LocaleContext.Provider value={{
        locale: locale || navigator.language
    }}>
        <div className={classNames} style={style}>
            <Header curMonth={curMonth} 
                prevMonthHandler={prevMonthHandler}
                nextMonthHandler={nextMonthHandler}
                todayHandler={todayHandler}
            ></Header>
            <MonthCalendar {...props} value={curValue} curMonth={curMonth} selectHandler={selectHandler}/>
        </div>
    </LocaleContext.Provider>
}

export default Calendar;
