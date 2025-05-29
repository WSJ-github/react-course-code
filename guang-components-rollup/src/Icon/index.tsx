import React, { PropsWithChildren, forwardRef } from 'react';
import cs from 'classnames';

import './index.scss';

type BaseIconProps = {
    className?: string;
    style?: React.CSSProperties;
    /** 图标大小 */
    size?: string | string[];
    /** 是否旋转 */
    spin?: boolean;
};

// 允许自定义基础prop类型 & 所有svg属性
export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps['size']) => {
    if (Array.isArray(size) && size.length === 2) {
        return size as string[];
    }

    // 当 SVG 的尺寸使用 em 单位时，它会相对于当前上下文的 font-size 来计算实际大小
    const width = (size as string) || '1em';
    const height = (size as string) || '1em';

    return [width, height];
};

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>((props, ref) => {
    
    const { 
        style,
        className, 
        spin, 
        size = '1em',
        children,
        ...rest 
    } = props;

    const [width, height] = getSize(size);

    const cn = cs( // 类名合并
        'icon',
        {
            'icon-spin': spin
        },
        className
    )

    return (
        <svg ref={ref} className={cn} style={style} width={width} height={height} fill="currentColor" {...rest}>
            {children}
        </svg>
    );
});

