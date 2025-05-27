import { useRef, PropsWithChildren, CSSProperties, FC, useCallback, useEffect } from 'react';
import useWatermark from './useWatermark';

export interface WatermarkProps extends PropsWithChildren {
    /** 样式 */
    style?: CSSProperties;
    /** 类名 */
    className?: string;
    /** z-index */
    zIndex?: string | number;
    /** 宽度 */
    width?: number;
    /** 高度 */
    height?: number;
    /** 旋转角度 */
    rotate?: number;
    /** 图片链接 
     * 比如：https://bkimg.cdn.bcebos.com/pic/8c1001e93901213f91ab2a7857e736d12e2e95fd?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536
    */
    image?: string;
    /** 文字内容 */
    content?: string | string[];
    /** 文字样式 */
    fontStyle?: {
      color?: string;
      fontFamily?: string;
      fontSize?: number | string;
      fontWeight?: number | string;
    };
    /** 间距 */
    gap?: [number, number];
    /** 偏移量 */
    offset?: [number, number];
    /** 获取容器的函数 */
    getContainer?: () => HTMLElement;
}

/** 支持 image｜text 绘制、防删除检测 */
const Watermark: FC<WatermarkProps>  = (props) => {

    const {
        className,
        style,
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const getContainer = useCallback(() => {
        return props.getContainer ? props.getContainer() : containerRef.current!;
    }, [containerRef.current, props.getContainer]);

    const { generateWatermark } = useWatermark({
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset,
        getContainer,
    });

    useEffect(() => {
        generateWatermark({
            zIndex,
            width,
            height,
            rotate,
            image,
            content,
            fontStyle,
            gap,
            offset,
            getContainer,
        });
    }, [
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        JSON.stringify(props.fontStyle),
        JSON.stringify(props.gap),
        JSON.stringify(props.offset),
        getContainer,
    ]);

    return props.children ? (
        <div
            className={className}
            style={style}
            ref={containerRef}
        >
            {props.children}
        </div>
    ) : null;
}

export default Watermark;
