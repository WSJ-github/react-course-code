import{j as n}from"./jsx-runtime-DiklIkkE.js";import{r as N,R as L}from"./index-DRjF_FHU.js";import{c as O}from"./index-lhGYx47h.js";const $=e=>Array.isArray(e)&&e.length===2?e:[e||"1em",e||"1em"],I=N.forwardRef((e,c)=>{const{style:o,className:r,spin:s,size:t="1em",children:T,...M}=e,[P,k]=$(t),B=O("icon",{"icon-spin":s},r);return n.jsx("svg",{ref:c,className:B,style:o,width:P,height:k,fill:"currentColor",...M,children:T})});I.__docgenInfo={description:"",methods:[],displayName:"Icon",props:{className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""},size:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:"图标大小"},spin:{required:!1,tsType:{name:"boolean"},description:"是否旋转"}}};function l(e){const{content:c,iconProps:o={},viewBox:r="0 0 1024 1024"}=e;return N.forwardRef((s,t)=>n.jsx(I,{ref:t,viewBox:r,...o,...s,children:c}))}const D=l({content:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"})})}),G=l({content:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M874.666667 181.333333H149.333333c-40.533333 0-74.666667 34.133333-74.666666 74.666667v512c0 40.533333 34.133333 74.666667 74.666666 74.666667h725.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V256c0-40.533333-34.133333-74.666667-74.666666-74.666667z m-725.333334 64h725.333334c6.4 0 10.666667 4.266667 10.666666 10.666667v25.6L512 516.266667l-373.333333-234.666667V256c0-6.4 4.266667-10.666667 10.666666-10.666667z m725.333334 533.333334H149.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V356.266667l356.266666 224c4.266667 4.266667 10.666667 4.266667 17.066667 4.266666s12.8-2.133333 17.066667-4.266666l356.266666-224V768c0 6.4-4.266667 10.666667-10.666666 10.666667z"})})}),p={IconAdd:D,IconEmail:G},u=new Set;function J(e){if(e.length&&!u.has(e)){const o=document.createElement("script");o.setAttribute("src",e),o.setAttribute("data-namespace",e),document.body.appendChild(o),u.add(e)}return L.forwardRef((o,r)=>{const{type:s,...t}=o;return n.jsx(I,{...t,ref:r,children:s?n.jsx("use",{xlinkHref:`#${s}`}):null})})}const X={title:"wusj-components/Icon 图标组件",component:I,parameters:{layout:"centered",docs:{description:{component:"\n\n `svg` `自定义icon` `icon样式调整` `内置icon` `支持iconfont载入` `支持ref引用`\n\n## Example Usage\n\n```jsx\nimport Icons from 'wusj-components';\n\nfunction App() {\n  return (\n    <>\n      <Icons.IconAdd></Icons.IconAdd>\n      <Icons.IconEmail></Icons.IconEmail>\n    </>\n  )\n}\n```\n"},source:{type:"code"}}},tags:["autodocs"],argTypes:{size:{control:{type:"text"}}}},a={render:e=>{const c=l({content:n.jsx(n.Fragment,{children:n.jsx("path",{d:"M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"})})});return n.jsx(n.Fragment,{children:n.jsx(c,{...e})})}},i={render:()=>n.jsxs(n.Fragment,{children:[n.jsx(p.IconAdd,{}),n.jsx(p.IconEmail,{})]}),parameters:{docs:{source:{code:`
import Icons from 'wusj-components';

function App() {
  return (
    <>
      <Icons.IconAdd></Icons.IconAdd>
      <Icons.IconEmail></Icons.IconEmail>
    </>
  )
}
        `,language:"jsx",type:"auto"}}}},d={render:()=>n.jsxs(n.Fragment,{children:[n.jsx(p.IconEmail,{style:{color:"blue",fontSize:"50px"}}),n.jsx(p.IconEmail,{spin:!0})]})},m={render:()=>{const e=J("//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js");return n.jsxs(n.Fragment,{children:[n.jsx(e,{type:"icon-shouye-zhihui",size:"40px"}),n.jsx(e,{type:"icon-gerenzhongxin-zhihui",fill:"blue",size:"40px"})]})}};var h,x,f,g,j;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: (args: IconProps) => {
    const IconAdd = createIcon({
      // 创建icon-初始预设值
      content: <>
          <path d="M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"></path>
        </>
    });
    return <>
        <IconAdd {...args} />
      </>;
  }
}`,...(f=(x=a.parameters)==null?void 0:x.docs)==null?void 0:f.source},description:{story:"自定义icon",...(j=(g=a.parameters)==null?void 0:g.docs)==null?void 0:j.description}}};var y,A,E,w,z;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    return <>
        <Icons.IconAdd></Icons.IconAdd>
        <Icons.IconEmail></Icons.IconEmail>
      </>;
  },
  parameters: {
    docs: {
      source: {
        code: \`
import Icons from 'wusj-components';

function App() {
  return (
    <>
      <Icons.IconAdd></Icons.IconAdd>
      <Icons.IconEmail></Icons.IconEmail>
    </>
  )
}
        \`,
        language: "jsx",
        type: "auto"
      }
    }
  }
}`,...(E=(A=i.parameters)==null?void 0:A.docs)==null?void 0:E.source},description:{story:"使用组件库中预设icon",...(z=(w=i.parameters)==null?void 0:w.docs)==null?void 0:z.description}}};var F,S,V,H,b;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    return <>
        <Icons.IconEmail style={{
        color: 'blue',
        fontSize: '50px'
      }}></Icons.IconEmail>
        <Icons.IconEmail spin></Icons.IconEmail>
      </>;
  }
}`,...(V=(S=d.parameters)==null?void 0:S.docs)==null?void 0:V.source},description:{story:"给icon设置样式",...(b=(H=d.parameters)==null?void 0:H.docs)==null?void 0:b.description}}};var R,v,_,q,C;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js');
    return <>
        <IconFont type="icon-shouye-zhihui" size="40px"></IconFont>
        <IconFont type="icon-gerenzhongxin-zhihui" fill="blue" size="40px"></IconFont>
      </>;
  }
}`,...(_=(v=m.parameters)==null?void 0:v.docs)==null?void 0:_.source},description:{story:"远程图标库（iconfont）加载icon",...(C=(q=m.parameters)==null?void 0:q.docs)==null?void 0:C.description}}};const Y=["CustomIcon","useIcons","IconStyle","RemoteIcon"];export{a as CustomIcon,d as IconStyle,m as RemoteIcon,Y as __namedExportsOrder,X as default,i as useIcons};
