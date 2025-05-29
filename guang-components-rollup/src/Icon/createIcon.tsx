import React, { forwardRef } from 'react';
import { Icon, IconProps } from '.';

interface CreateIconOptions {
  content: React.ReactNode;
  iconProps?: IconProps;
  viewBox?: string;
}

export function createIcon(options: CreateIconOptions) {
  // viewBox 对应svg视野（可供画图区大小），用户坐标系统，数值是无单位的，定义了一个抽象的"画布"大小，SVG 会自动缩放内容以适应实际显示大小
  const { content, iconProps = {}, viewBox = '0 0 1024 1024' } = options; // 创建自定义icon的预设值

  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    return <Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
      {content} 
    </Icon>
  });
}
