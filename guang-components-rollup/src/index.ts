import Calendar, { CalendarProps } from './Calendar';

import Watermark, { WatermarkProps } from './Watermark';

import { MessageProps, Position, MessageRef} from './Message';
import { useMessage } from './Message/useMessage';
import { ConfigProvider as MessageConfigProvider } from './Message/ConfigProvider';

import Form, { FormRefApi } from './Form';

import { Icon, IconProps } from './Icon'; // 图标组件
import { createFromIconfont } from './Icon/createFrontIconfont'; // 远程加载icon
import Icons from './Icon/icons'; // 内置icon
import { createIcon } from './Icon/createIcon'; // 创建自定义icon

import Space, { SpaceProps } from './Space';


export {
    Calendar,
    Watermark,
    MessageConfigProvider,
    useMessage,
    Form,
    Icon,
    Icons,
    createFromIconfont,
    createIcon,
    Space,
}

export type {
    CalendarProps,
    WatermarkProps,
    MessageProps,
    Position,
    MessageRef,
    FormRefApi,
    IconProps,
    SpaceProps
}
