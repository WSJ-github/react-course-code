import { useRef } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react';

import './App.css';

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

function Viewpager() {
  const index = useRef(0);
  const width = window.innerWidth;

  const [props, api] = useSprings(pages.length, i => ({
    x: i * width, // 每张图片的初始位置，实际用transform: translate3d(<x>, 0px, 0px)去控制
    scale: 1 // 每张图片的初始缩放比例
  }));

  /***
   * 【使用拖拽手势】
   * active: 是否正在拖拽（cancel执行之后，还会最后一次执行回调，此时active为false）
   * movement: 拖拽的距离（【负数】表示手势向左，但图片是向右移动，即下一张；【正数】表示手势向右，但图片是向左移动，即上一张）
   * direction: 拖拽的方向（【负数】表示手势向左，【正数】表示手势向右）
   * cancel: 取消拖拽
   */
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    console.log(active, mx, xDir);
    if (active && Math.abs(mx) > width / 2) {
      // 拖动距离大于一半屏幕宽度，则切换图片
      let newIndex = index.current + (xDir > 0 ? -1 : 1);

      if(newIndex < 0) {
        newIndex = 0;
      }

      if(newIndex > pages.length - 1) {
        newIndex = pages.length - 1;
      }

      index.current =  newIndex;

      cancel() // 取消后还会调一次当前的回调，此时active为false
    }
    // 调整各个图片的动画属性值，会有持续的动画效果（通过【api】拿到动画元素控制权）
    api.start(i => {
      const x = (i - index.current) * width + (active ? mx : 0) // 调整图片x方向上的偏移
      const scale = active ? 1 - Math.abs(mx) / width / 2 : 1 // 拖动距离越大，缩放比例越小，图片越小
      return { x, scale }
    })
  });

  return (
    <div className='wrapper'>
      {props.map(({ x, scale }, i) => (
        <animated.div className='page' {...bind()} key={i} style={{ x }}>
          <animated.div style={{ scale, backgroundImage: `url(${pages[i]})` }} />
        </animated.div>
      ))}
    </div>
  )
}

export default Viewpager;
