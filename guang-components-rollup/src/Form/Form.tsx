import React, { CSSProperties, useState, useRef, FormEvent, ReactNode, ForwardRefRenderFunction, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import FormContext from './FormContext';

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    style?: CSSProperties;
    /** 表单提交成功的回调 */
    onFinish?: (values: Record<string, any>) => void;
    /** 表单提交失败的回调 */
    onFinishFailed?: (errors: Record<string, any>) => void;
    /** 表单初始值 */
    initialValues?: Record<string, any>;
    /** 表单子元素 */
    children?: ReactNode
}

export interface FormRefApi {
    getFieldsValue: () => Record<string, any>, // 获取表单值
    setFieldsValue: (values: Record<string, any>) => void, // 设置表单值
}

const Form= forwardRef<FormRefApi, FormProps>((props: FormProps, ref) => {
    const { 
        className, 
        style,
        children, 
        onFinish,
        onFinishFailed,
        initialValues,
        ...others 
    } = props;

    
    // console.log('111111') // Form渲染函数先执行


    const [values, setValues] = useState<Record<string, any>>(initialValues || {}); // 全局表单Store，收集所有表单项数据

    useImperativeHandle(ref, () => {
        return {
            getFieldsValue() {
                return values;
            },
            setFieldsValue(fieldValues) {
                setValues({...values, ...fieldValues});
            }
        }
    }, []);

    const validatorMap = useRef(new Map<string, Function>()); // 存储所有表单项的验证函数

    const errors = useRef<Record<string, any>>({}); // 存储所有表单项的错误信息

    /**
     * 表单项值改变
     * @param key 表单项的key
     * @param value 表单项的值
     */
    const onValueChange = (key: string, value: any) => {
        values[key] = value; // 直接更新全局表单项值，不会触发全量rerender
    }

    // 表单提交
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // 遍历所有表单项的验证函数，执行验证
        for (let [key, callbackFunc] of validatorMap.current) {
            if (typeof callbackFunc === 'function') {
                errors.current[key] = callbackFunc();
            }
        }

        // 过滤出有错误信息的表单项
        const errorList = Object.keys(errors.current).map(key => {
                return errors.current[key]
        }).filter(Boolean);

        // 如果存在错误信息，则调用onFinishFailed
        if (errorList.length) {
            onFinishFailed?.(errors.current);
        } else {
            // 如果没有任何错误信息，则调用onFinish
            onFinish?.(values);
        }
    }

    // 注册表单项的验证函数
    const handleValidateRegister = (name: string, cb: Function) => {
        validatorMap.current.set(name, cb);
    }

    const cls = classNames('ant-form', className);

    return (
        // 使用FormContext.Provider提供上下文，暴露出去
        <FormContext.Provider
            value={{
                onValueChange,
                values,
                setValues: (v) => setValues(v),
                validateRegister: handleValidateRegister
            }}
        >
            <form {...others} className={cls} style={style} onSubmit={handleSubmit}>{children}</form>
        </FormContext.Provider>
    );
})

export default Form;
