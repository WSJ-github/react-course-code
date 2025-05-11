import React, { CSSProperties, useEffect, useState } from 'react';
import { getMaskStyle } from './getMaskStyle'

import './index.scss';

interface MaskProps {
  element: HTMLElement;

  container?: HTMLElement;

  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;

  onAnimationStart?: () => void;

  onAnimationEnd?: () => void;
}

export const Mask: React.FC<MaskProps> = (props) => {
  const {
    element,
    renderMaskContent,
    container,
    onAnimationStart,
    onAnimationEnd
  } = props;

  useEffect(() => {
    console.log('timeout effect');
    onAnimationStart?.();
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [element]);

  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    // 这一步有隐患，可能掉入闭包陷阱，小心！！！
    const observer = new ResizeObserver(() => {
      const style = getMaskStyle(element, container || document.documentElement);
      // console.log(element) // 每次都是相同的element
  
      setStyle(style);
    });
    observer.observe(container || document.documentElement);
  }, []);

  useEffect(() => {
    if (!element) {
      return;
    }

    element.scrollIntoView({ // 滚动到元素中心
        block: 'center',
        inline: 'center'
    });
  
    const style = getMaskStyle(element, container || document.documentElement);
  
    setStyle(style);
    
  }, [element, container]);

  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }
    return renderMaskContent(
      <div className={'mask-content'} style={{ width: '100%', height: '100%' }} />
    );
  };

  return (
    <div
      style={style}
      className='mask'>
      {getContent()}
    </div>
  );
};
