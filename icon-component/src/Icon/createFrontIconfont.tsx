import React from 'react';
import { Icon, IconProps } from './';

const loaded = new Set<string>();

export function createFromIconfont(scriptUrl: string) {
  // 1. 地址其实对应的是iconfont项目，如果没有加载过，那就尽管去加载，加载完该文件的本质是一个大的svg+defs+g/symbols定义的该项目的图标（用id标识）
  // ---我们在后面只需要用use xlinkHref={`#${type}`} 去引用即可（type就对应id）
  if (
    typeof scriptUrl === 'string'
    && scriptUrl.length
    && !loaded.has(scriptUrl)
  ) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    document.body.appendChild(script);

    loaded.add(scriptUrl);
  }

  // 2. 返回该iconfont项目对应的图标加载器组件，传入对应type（即id），即可使用
  const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;

    return (
      <Icon {...rest} ref={ref}>
        { type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });

  return Iconfont;
}
