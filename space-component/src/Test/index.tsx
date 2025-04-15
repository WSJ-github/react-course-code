import React from 'react';

interface TestProps {
  children?: React.ReactNode
}
export const TestInner: React.FC<TestProps> = (props) => {
  console.log(props.children)
  return <div>
    你好我是TestInner组件
    {props.children}
  </div>
}

export default function Test(props: TestProps) {
  console.log(props.children)
  return <div>
    {props.children}
  </div>
}