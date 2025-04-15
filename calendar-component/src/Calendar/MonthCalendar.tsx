import { Dayjs } from "dayjs";
import { CalendarProps } from ".";
import LocaleContext from "./LocaleContext";
import { useContext } from "react";
import allLocales from "./locale";
import cs from "classnames";

interface MonthCalendarProps extends CalendarProps {
    selectHandler?: (date: Dayjs) => void;
    curMonth: Dayjs
}

/**
 * 获取当月所有天数信息
 * @param date 
 * @returns 
 */
function getAllDays(date: Dayjs) {
    const startDate = date.startOf('month'); // 获取当月第一天
    const day = startDate.day()  // 获取当月第一天是星期几

    const daysInfo: Array<{date: Dayjs, currentMonth: boolean}> = new Array(6 * 7);

    for(let i = 0 ; i < day; i++) {
        daysInfo[i] = {
            date: startDate.subtract(day - i, 'day'),
            currentMonth: false
        }
    }

    for(let i = day ; i < daysInfo.length; i++) {
        const calcDate = startDate.add(i - day, 'day');

        daysInfo[i] = {
            date: calcDate,
            currentMonth: calcDate.month() === date.month()
        }
    }

    return daysInfo;
}


function MonthCalendar(props: MonthCalendarProps) {

    const localeContext = useContext(LocaleContext);
    
    const {
        value,
        curMonth,
        dateRender,
        dateInnerContent,
        selectHandler
    } = props;

    const CalendarLocale = allLocales[localeContext.locale];

    const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

    const allDays = getAllDays(curMonth); // 获取当月所有日期信息


    function renderDays(
        days: Array<{ date: Dayjs, currentMonth: boolean}>
    ) {
        const rows = [];
        for(let i = 0; i < 6; i++ ) {
            const row = [];
            for(let j = 0; j < 7; j++) {
                const item = days[i * 7 + j];
                // 封装单元格
                row[j] = <div className={
                    "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '') // 日期是当月，则添加样式
                }
                    onClick={() => selectHandler?.(item.date)} // 点击单元格，触发事件
                >
                    {
                        dateRender ? dateRender(item.date) : ( // 如果使用自定义dateRender，那么需要处理选中样式，最好配合受控模式
                            <div className="calendar-month-body-cell-date">
                                <div className={
                                    cs("calendar-month-body-cell-date-value", // class合并
                                        value?.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                                            ? "calendar-month-body-cell-date-selected"
                                            : ""
                                    )
                                }>{item.date.date()}</div>
                                <div className="calendar-month-cell-body-date-content">{dateInnerContent?.(item.date)}</div>
                            </div>
                        )
                    }
                </div>
            }
            rows.push(row);
        }
        return rows.map(row => <div className="calendar-month-body-row">{row}</div>) // 封装行
    }

    return <div className="calendar-month">
        <div className="calendar-month-week-list">
            {weekList.map((week) => (
                <div className="calendar-month-week-list-item" key={week}>
                    {CalendarLocale.week[week]}
                </div>
            ))}
        </div>
        <div className="calendar-month-body">
            {
                renderDays(allDays)
            }
        </div>
    </div>
}

export default MonthCalendar;
