import{j as e}from"./jsx-runtime-DiklIkkE.js";import{R as c}from"./index-DRjF_FHU.js";import{c as U}from"./index-lhGYx47h.js";const A=c.createContext({});function $(a){const{space:s,children:o}=a;return e.jsx(A.Provider,{value:{space:s},children:o})}$.__docgenInfo={description:"",methods:[],displayName:"ConfigProvider",composes:["PropsWithChildren"]};const V={small:8,middle:16,large:24};function B(a){return typeof a=="string"?V[a]:a||0}const m=a=>{const{space:s}=c.useContext(A),{className:o,style:p,children:E,size:r=(s==null?void 0:s.size)||"small",direction:u="horizontal",align:v,split:x,wrap:k=!0,...G}=a,g=c.Children.toArray(E),b=u==="horizontal"&&v===void 0?"center":v,I=U("space",`space-${u}`,{[`space-align-${b}`]:b},o),W=g.map((n,f)=>{const O=n&&n.key||`space-item-${f}`;return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"space-item",children:n},O),f<g.length-1&&x&&e.jsx("span",{className:`${o}-split`,style:p,children:x})]})}),t={},[F,M]=c.useMemo(()=>(Array.isArray(r)?r:[r,r]).map(n=>B(n)),[r]);return t.columnGap=F,t.rowGap=M,k&&(t.flexWrap="wrap"),e.jsx("div",{className:I,style:{...t,...p},...G,children:W})};m.__docgenInfo={description:"",methods:[],displayName:"Space",props:{className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""},size:{required:!1,tsType:{name:"union",raw:"SizeType | [SizeType, SizeType]",elements:[{name:"union",raw:"'small' | 'middle' | 'large' | number | undefined",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'middle'"},{name:"literal",value:"'large'"},{name:"number"},{name:"undefined"}]},{name:"tuple",raw:"[SizeType, SizeType]",elements:[{name:"union",raw:"'small' | 'middle' | 'large' | number | undefined",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'middle'"},{name:"literal",value:"'large'"},{name:"number"},{name:"undefined"}]},{name:"union",raw:"'small' | 'middle' | 'large' | number | undefined",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'middle'"},{name:"literal",value:"'large'"},{name:"number"},{name:"undefined"}]}]}]},description:"间距大小(row-gap, column-gap)"},direction:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:`排列方向
@default "horizontal"`},align:{required:!1,tsType:{name:"union",raw:"'start' | 'end' | 'center' | 'baseline'",elements:[{name:"literal",value:"'start'"},{name:"literal",value:"'end'"},{name:"literal",value:"'center'"},{name:"literal",value:"'baseline'"}]},description:"对齐方式"},split:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"分割线"},wrap:{required:!1,tsType:{name:"boolean"},description:`是否换行
@default true`}}};const K={title:"wusj-components/Space 间距组件",component:m,parameters:{layout:"centered",docs:{description:{component:`

 \`基于flex布局\` \`支持全局配置\`

## Example Usage

\`\`\`jsx
import Space from 'wusj-components';

function App() {
  return (
    <>
      <Space direction="horizontal" wrap={true}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </>
  )
}
\`\`\`
`},source:{type:"code"}}},tags:["autodocs"],argTypes:{children:{control:!1,table:{type:{summary:"ReactNode"}}},size:{control:{type:"radio"},table:{type:{summary:"small | middle | large | number | undefined"},defaultValue:{summary:"small"}},options:["small","middle","large"]},split:{control:!1,table:{type:{summary:"ReactNode"}}}}},d={args:{children:[e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"})]}},i={render:a=>e.jsx("div",{children:e.jsx($,{space:{size:50},children:e.jsxs(m,{...a,children:[e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"})]})})})},l={args:{split:"【线】",children:[e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"}),e.jsx("div",{className:"box"})]}};var N,y,S;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    children: [<div className="box"></div>, <div className="box"></div>, <div className="box"></div>, <div className="box"></div>]
    // wrap: false,
  }
}`,...(S=(y=d.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var h,j,z,w,P;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: (args: SpaceProps) => {
    return <div>
    <SpaceConfigProvider space={{
        size: 50
      }}>
      <Space {...args}>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </SpaceConfigProvider>
  </div>;
  }
}`,...(z=(j=i.parameters)==null?void 0:j.docs)==null?void 0:z.source},description:{story:"Provider全局配置注入",...(P=(w=i.parameters)==null?void 0:w.docs)==null?void 0:P.description}}};var T,C,R,q,_;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    split: '【线】',
    children: [<div className="box"></div>, <div className="box"></div>, <div className="box"></div>, <div className="box"></div>]
  }
}`,...(R=(C=l.parameters)==null?void 0:C.docs)==null?void 0:R.source},description:{story:"分割线",...(_=(q=l.parameters)==null?void 0:q.docs)==null?void 0:_.description}}};const L=["common","Provider","Split"];export{i as Provider,l as Split,L as __namedExportsOrder,d as common,K as default};
