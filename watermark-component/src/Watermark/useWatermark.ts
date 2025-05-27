import { useEffect, useRef, useState } from 'react';
import { WatermarkProps } from '.';
import { merge } from 'lodash-es';

export type WatermarkOptions = Omit<WatermarkProps, 'className' | 'style' | 'children'>; 

export function isNumber(obj: any): obj is number {
  return Object.prototype.toString.call(obj) === '[object Number]' && obj === obj;
}

const toNumber = (value?: string | number, defaultValue?: number) => {
  if(value === undefined) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  getContainer: () => document.body,
};

/***
 * 用户自定义选项和默认选项进行合并
 */
const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(options.width, options.image ? defaultOptions.width : undefined),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>; // 因为有默认选项，所以这里可以断定所有选项都有值（所以断言）

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(mergedOptions.offset?.[1] || mergedOptions.offset?.[0], 0)!;
  mergedOptions.offset = [ mergedOffsetX, mergedOffsetY ];

  return mergedOptions;
};

/***
 * 测量文字的大小
 */
const measureTextSize = (
  ctx: CanvasRenderingContext2D,
  // 水印文字内容数组（支持多行），注意这里content会是两种情况之一：
  // 1.原始传入字符串，此时content = ['神', '说', '要', ...]（因为调用当前函数前对字符串进行了解构），所以最后这种情况下会竖向绘制
  // 2.原始传入字符串数组，此时content = ['测试水印', '神说要有光']，两行绘制
  content: string[],
  rotate: number
) => {
  let width = 0; // 文字块（即所有行）的最大宽度
  let height = 0; // 文字块（即所有行）的总高度
  const lineSize: Array<{width: number, height: number}> = [];

  content.forEach((item) => {
    const {
      width: textWidth,
      fontBoundingBoxAscent, // 文字基线以上的高度
      fontBoundingBoxDescent, // 文字基线以下的高度
    } = ctx.measureText(item);

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent; // 行高

    if (textWidth > width) {
      width = textWidth; // 记录最大宽度（所有行中）
    }

    height += textHeight; // 累加每行高度
    // 记录每行文字的宽高信息
    lineSize.push({ height: textHeight, width: textWidth });
  });

  const angle = (rotate * Math.PI) / 180; // 角度转弧度

  return {
    originWidth: width, // 原始行最长宽度（未旋转）
    originHeight: height, // 原始所有行总高度（未旋转）
    // 注意此时只是用公式计算出文字块渲染后的测量高度，并没有实际绘制，所以此时width和height只是测量值
    width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)), // 旋转后文字块的宽度
    height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))), // 旋转后文字块的高度
    lineSize, // 每行的尺寸信息
  };
};

/***
 * 生成水印的canvas数据
 */
const getCanvasData = async (
  options: Required<WatermarkOptions>,
): Promise<{ width: number; height: number; base64Url: string }> => {

  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const ratio = window.devicePixelRatio; // 设备像素比，用于计算canvas的实际大小

  /***
   * 配置水印画布context
   */
  const configCanvas = (size: { width: number, height: number }) => {
    // 水印画布宽高要加上水印之间的间距
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    // 设置canvas的实际（物理）大小：
    // 后续对这个画布的绘制操作都会基于这个物理像素大小来绘制
    canvas.setAttribute('width', `${canvasWidth * ratio}px`);
    canvas.setAttribute('height', `${canvasHeight * ratio}px`);
    // 设置canvas的样式大小：最终展示的大小
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2); // 将画布原点移到中心位置，这样旋转时会围绕中心点
    // 缩放画布，以适应设备像素比
    // 如果不设置，我们绘制操作就要考虑设备像素比，会很麻烦
    // 设置后我们正常按照设置width和height绘制，然后内部会自动进行缩放
    // 比如我们的width和height是100px，dpr=2,那么绘制的时候，内部会自动进行2倍放大（所以ctx.fillRect(0, 0, 100, 100);时会绘制200*200的矩形）
    // TODO: 这样我们绘制的时候，就不需要考虑设备像素比了，直接按照设置的理想值绘制即可
    ctx.scale(ratio, ratio);

    // 将角度转换为弧度（JavaScript 中的 rotate 方法使用弧度）
    const RotateAngle = (rotate * Math.PI) / 180;
    // TODO:
    // 在绘制内容之前调用的。这是因为 Canvas 的变换操作（如 translate、rotate、scale）会影响后续的所有绘制操作
    // 先设置好所有变换，再进行绘制，这样可以确保内容按预期方式显示
    // TODO: 旋转坐标系统，这会影响后续所有绘制的内容，而不是旋转已经绘制的内容或画布本身。
    ctx.rotate(RotateAngle);
  };

  /***
   * TODO: 画布中绘制用户自定义传入的文字
   */
  const drawText = () => {
    const { fontSize, color, fontWeight, fontFamily } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`; // 设置画布中字体基准属性
    const measureSize = measureTextSize(ctx, [...content], rotate); // 测量文字块的宽高

    // 优先使用用户自定义的宽度，否则使用测量结果（整个画布绘制的文字块（旋转后）的宽高）
    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    // 设置好画布的宽高（物理/样式），并提前配置好画布内的元素的变换操作（缩放/旋转等，实际绘制时会应用到具体绘制的元素上）
    configCanvas({ width, height });

    ctx.fillStyle = color!;
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';

    // 遍历绘制每行文字
    [...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } = measureSize.lineSize[index];

      // 参考图片绘制注释
      const xStartPoint = -lineWidth / 2; // （单行文字块绘制原点向左偏移）效果：每行文字都宽度居中
      // （单行文字块绘制原点向上偏移）效果：定位到相对正确的绘制起点，所以这里用measureSize.originHeight，不然向上偏移多了会导致旋转后部分被隐藏掉了
      const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth
      );
    });
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  /***
   * 画布中绘制用户自定义传入的图片
   */
  function drawImage() {
    return new Promise<{ width: number; height: number; base64Url: string }>((resolve) => {
      const img = new Image();
    img.crossOrigin = 'anonymous'; // 跨域则不传cookie
    img.referrerPolicy = 'no-referrer'; // 不传referrer（来路）

    img.src = image;
    img.onload = () => {
      let { width, height } = options;
      // 缺少任意一个，则根据图片宽高比计算另一个
      if (!width || !height) {
        if (width) {
          height = (img.height / img.width) * +width;
        } else {
          width = (img.width / img.height) * +height;
        }
      }
      configCanvas({ width, height });

      // 因为configCanvas中通过ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);配置了画布原点在中心
      // 如果这时候我们直接从(0,0)开始画图，即ctx.drawImage(img, 0, 0, width, height);那么图片会把画布原点当成绘制的起点，即图片的左上角
      // 所以这里设置-width / 2, -height / 2，是让图片像左上角偏移图片一般的位置，此时图片的中心点正好和画布原点重合
      // 当然因为内部设置了ctx.scale(ratio, ratio);，所以也会等比例放大绘制区域，当然这不需要我们太关注，是自动完成的
      // 补充TODO: 其实这里移动之后绘制的数据块的上下左右都只有对应gap的1/2，但是因为canvas背景块是repeat的，所以重叠的canvas块也是只有1/2，加起来就是1，正好是gap值
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      return resolve({ base64Url: canvas.toDataURL(), width, height });
    };
    img.onerror = () => {
      return drawText();
    };
  });
}
  
  return image ? drawImage() : drawText(); // 如果用户传入了图片，则优先绘制图片，否则绘制文字
};


export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>();
  const mutationObserver = useRef<MutationObserver>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  function drawWatermark() {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {

      const offsetLeft = mergedOptions.offset[0] + 'px';
      const offsetTop = mergedOptions.offset[1] + 'px';

      const wmStyle = `
      width:calc(100% - ${offsetLeft});
      height:calc(100% - ${offsetTop});
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

      if (!watermarkDiv.current) {
        const div = document.createElement('div');
        watermarkDiv.current = div;
        container.append(div);
        container.style.position = 'relative';
      }

      watermarkDiv.current?.setAttribute('style', wmStyle.trim());

      // 监听水印元素是否被删除or变更属性，如果是则重新绘制生成水印元素
      if (container) {
        mutationObserver.current?.disconnect();

        mutationObserver.current = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).some((node) => node === watermarkDiv.current);
            }
            if (mutation.type === 'attributes' && mutation.target === watermarkDiv.current) {
              flag = true;
            }
            return flag;
          });
          if (isChanged) {
            watermarkDiv.current?.parentNode?.removeChild(watermarkDiv.current);
            watermarkDiv.current = undefined;
            drawWatermark();
          }
        });

        mutationObserver.current.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      }
    });
  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    }
  };
}
