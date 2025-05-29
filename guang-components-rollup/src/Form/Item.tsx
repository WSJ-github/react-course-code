import React, { ReactNode, CSSProperties, useState, useContext, ReactElement, useEffect, PropsWithChildren, ChangeEvent } from 'react';
import classNames from 'classnames';
import Schema, { Rules } from 'async-validator'; // 表单校验库

import FormContext from './FormContext';

export interface ItemProps{
    className?: string;
    style?: CSSProperties;  
    /** 表单项的标签 */
    label?: ReactNode;
    /** 表单项的名称（用于后续收集提交的key） */
    name?: string;
    /** 表单项的值的属性名（value/checked） */
    valuePropName?: string;
    /** 表单项的验证规则 */
    rules?: Array<Record<string, any>>;
    /** 表单项的子元素（注意这里是ReactElement，而不是ReactNode，因为要求表单项子元素一定要是element节点） */
    children?: ReactElement
}

// 根据表单元素类型取不同属性，从而正确获取表单项的值
const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target.type === 'checkbox') {
        return target.checked;
    } else if (target.type === 'radio') {
        return target.value;
    }

    return target.value;
}

const Item = (props: ItemProps) => {
    const { 
        className,
        label,
        children,
        style,
        name,
        valuePropName,
        rules,
    } = props;


    // console.log('222222') // From-Item渲染函数后执行


    // 如果表单项没有name，则直接返回children
    if(!name) {
        return children;
    }

    const [value, setValue] = useState<string | number | boolean>(); // 表单项内部维护自己的状态值
    const [error, setError] = useState(''); // 表单项内部维护自己的错误信息（展示用）

    /**
     * @param onValueChange 全局表单Store的onValueChange --- 用于更新全局表单Store中对应表单项的值（局部更新，不会触发Form组件的rerender）
     * @param values 全局表单Store的values --- 全局表单Store中所有表单项的值
     * @param validateRegister 全局表单Store的validateRegister --- 用于注册表单项的验证函数（用于后续表单提交的时候校验所有表单项，会统一收集错误信息交由用户自定义回调处理）
     */
    const { onValueChange, values, validateRegister } = useContext(FormContext);

    // 如果表单项的值与全局表单Store中的值不一致，则更新表单项的值【同步】
    useEffect(() => {
        if (value !== values?.[name]) {
            setValue(values?.[name]);
        }
    }, [values, values?.[name]])

    // 表单项校验逻辑
    const handleValidate = (value: any) => {
        let errorMsg = null;
        if (Array.isArray(rules) && rules.length) {
            // 创建校验器
            const validator = new Schema({
                [name]: rules.map(rule => {
                    return {
                        type: 'string',
                        ...rule
                    }
                })
            });

            // 执行校验
            validator.validate({ [name]:value }, (errors) => {
                if (errors) {
                    if (errors?.length) {
                        setError(errors[0].message!);
                        errorMsg = errors[0].message;
                    }
                } else {
                    setError('');
                    errorMsg = null;
                }
            });

        }

        return errorMsg;
    }

    useEffect(() => {
        // 到全局去注册表单项的验证函数，充分利用闭包（以便表单提交的时候校验所有表单项）
        validateRegister?.(name, () => handleValidate(value));
    }, [value]);

    const propsName: Record<string, any> = {};
    if (valuePropName) {
        propsName[valuePropName] = value;
    } else {
        propsName.value = value;
    }

    // 一个表单项对应多个子元素时，直接返回children，全局表单不接管
    const childEle = React.Children.toArray(children).length > 1 ? children: React.cloneElement(children!, {
        ...propsName,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const value = getValueFromEvent(e);
            // 表单项数据变更，需要同时更新表单项内部维护的状态值，以及全局表单Store中的值
            setValue(value);
            onValueChange?.(name, value);

            /**
             * TODO:
             * 补充：这里onValueChange并没有触发全局Store（即values）的变更，所以不会触发整个Form组件更新，只是同步了对应表单项的值而已，此时只会rerender当前表单项组件
             * -----这样做的好处是：
             * 1. 表单项内部维护自己的状态值，可以避免全局Store的变更触发整个Form组件更新，从而提高性能
             */

            // 单个表单项变更，自己内部触发校验即可
            handleValidate(value);
        }
    });

    const cls = classNames('ant-form-item', className);

    return (
        <div className={cls} style={style}>
            <div>
                {
                    label && <label>{label}</label>
                }
            </div>
            <div>
                {childEle}
                {error && <div style={{color: 'red'}}>{error}</div>}
            </div>
        </div>
    )
}

export default Item;