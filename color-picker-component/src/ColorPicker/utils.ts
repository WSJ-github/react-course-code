import { TransformOffset } from "./Transform";
import { Color } from "./color";

/***
 * 根据滑块偏移量和容器信息计算新color
 */
export const calculateColor = (props: {
    offset: TransformOffset;
    containerRef: React.RefObject<HTMLDivElement>;
    targetRef: React.RefObject<HTMLDivElement>;
    color: Color;
}): Color => {
    const { offset, targetRef, containerRef, color } = props;

    const { width, height } = containerRef.current!.getBoundingClientRect();
    const { 
        width: targetWidth,
        height: targetHeight
    } = targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;

    const saturation = (offset.x + centerOffsetX) / width; // 计算饱和度
    const lightness = 1 - (offset.y + centerOffsetY) / height; // 计算明度

    const hsv = color.toHsv();

    return new Color({
        h: hsv.h,
        s: saturation <= 0 ? 0 : saturation,
        v: lightness >= 1 ? 1 : lightness,
        a: hsv.a // 透明度
    });
}

/***
 * 根据全局color state计算滑块偏移量
 */
export const calculateOffset = (
    containerRef: React.RefObject<HTMLDivElement>,
    targetRef: React.RefObject<HTMLDivElement>,
    color: Color
): TransformOffset => {
    const { width, height } = containerRef.current!.getBoundingClientRect();
    const { 
        width: targetWidth,
        height: targetHeight 
    } = targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2; // 滑块半径
    const centerOffsetY = targetHeight / 2;
    const hsv = color.toHsv();

    return {
        x: hsv.s * width - centerOffsetX, // 横向代表饱和度(左到右0-1)，饱和度越大，颜色越深，这里计算出横向偏移
        y: (1 - hsv.v) * height - centerOffsetY, // 纵向代表明度(下到上0-1)，明度越大，颜色越亮，这里计算出纵向偏移
    };
};

