import{j as u}from"./jsx-runtime-DiklIkkE.js";import{r as p,R as m}from"./index-DRjF_FHU.js";import{I as N,r as En}from"./index-KG6Eoqhz.js";import{_ as Mn,a as _,b as mn,c as yn,B as f}from"./button-DdCHhT5M.js";import"./index-lhGYx47h.js";const G={top:[],bottom:[]};function jn(s){const[r,a]=p.useState({...G});return{messageList:r,add:e=>{const t=Rn(e);return a(n=>{if(e!=null&&e.id&&w(n,e.id))return n;const o=e.position||s,d=o.includes("top")?[{...e,id:t},...n[o]??[]]:[...n[o]??[],{...e,id:t}];return{...n,[o]:d}}),t},update:(e,t)=>{e&&a(n=>{const o={...n},{position:i,index:d}=bn(o,e);return i&&d!==-1&&(o[i][d]={...o[i][d],...t}),o})},remove:e=>{a(t=>{const n=w(t,e);return n?{...t,[n]:t[n].filter(o=>o.id!==e)}:t})},clearAll:()=>{a({...G})}}}let W=1;function Rn(s){return s.id?s.id:(W+=1,W)}function w(s,r){for(const[a,e]of Object.entries(s))if(e.find(t=>t.id===r))return a}function bn(s,r){const a=w(s,r),e=a?s[a].findIndex(t=>t.id===r):-1;return{position:a,index:e}}function $(s,r){s.prototype=Object.create(r.prototype),s.prototype.constructor=s,Mn(s,r)}function Nn(s,r){return s.classList?!!r&&s.classList.contains(r):(" "+(s.className.baseVal||s.className)+" ").indexOf(" "+r+" ")!==-1}function kn(s,r){s.classList?s.classList.add(r):Nn(s,r)||(typeof s.className=="string"?s.className=s.className+" "+r:s.setAttribute("class",(s.className&&s.className.baseVal||"")+" "+r))}function X(s,r){return s.replace(new RegExp("(^|\\s)"+r+"(?:\\s|$)","g"),"$1").replace(/\s+/g," ").replace(/^\s*|\s*$/g,"")}function Sn(s,r){s.classList?s.classList.remove(r):typeof s.className=="string"?s.className=X(s.className,r):s.setAttribute("class",X(s.className&&s.className.baseVal||"",r))}const Y={disabled:!1},L=m.createContext(null);var hn=function(r){return r.scrollTop},b="unmounted",C="exited",E="entering",R="entered",A="exiting",h=function(s){$(r,s);function r(e,t){var n;n=s.call(this,e,t)||this;var o=t,i=o&&!o.isMounting?e.enter:e.appear,d;return n.appearStatus=null,e.in?i?(d=C,n.appearStatus=E):d=R:e.unmountOnExit||e.mountOnEnter?d=b:d=C,n.state={status:d},n.nextCallback=null,n}r.getDerivedStateFromProps=function(t,n){var o=t.in;return o&&n.status===b?{status:C}:null};var a=r.prototype;return a.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},a.componentDidUpdate=function(t){var n=null;if(t!==this.props){var o=this.state.status;this.props.in?o!==E&&o!==R&&(n=E):(o===E||o===R)&&(n=A)}this.updateStatus(!1,n)},a.componentWillUnmount=function(){this.cancelNextCallback()},a.getTimeouts=function(){var t=this.props.timeout,n,o,i;return n=o=i=t,t!=null&&typeof t!="number"&&(n=t.exit,o=t.enter,i=t.appear!==void 0?t.appear:o),{exit:n,enter:o,appear:i}},a.updateStatus=function(t,n){if(t===void 0&&(t=!1),n!==null)if(this.cancelNextCallback(),n===E){if(this.props.unmountOnExit||this.props.mountOnEnter){var o=this.props.nodeRef?this.props.nodeRef.current:N.findDOMNode(this);o&&hn(o)}this.performEnter(t)}else this.performExit();else this.props.unmountOnExit&&this.state.status===C&&this.setState({status:b})},a.performEnter=function(t){var n=this,o=this.props.enter,i=this.context?this.context.isMounting:t,d=this.props.nodeRef?[i]:[N.findDOMNode(this),i],c=d[0],l=d[1],g=this.getTimeouts(),x=i?g.appear:g.enter;if(!t&&!o||Y.disabled){this.safeSetState({status:R},function(){n.props.onEntered(c)});return}this.props.onEnter(c,l),this.safeSetState({status:E},function(){n.props.onEntering(c,l),n.onTransitionEnd(x,function(){n.safeSetState({status:R},function(){n.props.onEntered(c,l)})})})},a.performExit=function(){var t=this,n=this.props.exit,o=this.getTimeouts(),i=this.props.nodeRef?void 0:N.findDOMNode(this);if(!n||Y.disabled){this.safeSetState({status:C},function(){t.props.onExited(i)});return}this.props.onExit(i),this.safeSetState({status:A},function(){t.props.onExiting(i),t.onTransitionEnd(o.exit,function(){t.safeSetState({status:C},function(){t.props.onExited(i)})})})},a.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},a.safeSetState=function(t,n){n=this.setNextCallback(n),this.setState(t,n)},a.setNextCallback=function(t){var n=this,o=!0;return this.nextCallback=function(i){o&&(o=!1,n.nextCallback=null,t(i))},this.nextCallback.cancel=function(){o=!1},this.nextCallback},a.onTransitionEnd=function(t,n){this.setNextCallback(n);var o=this.props.nodeRef?this.props.nodeRef.current:N.findDOMNode(this),i=t==null&&!this.props.addEndListener;if(!o||i){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var d=this.props.nodeRef?[this.nextCallback]:[o,this.nextCallback],c=d[0],l=d[1];this.props.addEndListener(c,l)}t!=null&&setTimeout(this.nextCallback,t)},a.render=function(){var t=this.state.status;if(t===b)return null;var n=this.props,o=n.children;n.in,n.mountOnEnter,n.unmountOnExit,n.appear,n.enter,n.exit,n.timeout,n.addEndListener,n.onEnter,n.onEntering,n.onEntered,n.onExit,n.onExiting,n.onExited,n.nodeRef;var i=_(n,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return m.createElement(L.Provider,{value:null},typeof o=="function"?o(t,i):m.cloneElement(m.Children.only(o),i))},r}(m.Component);h.contextType=L;h.propTypes={};function j(){}h.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:j,onEntering:j,onEntered:j,onExit:j,onExiting:j,onExited:j};h.UNMOUNTED=b;h.EXITED=C;h.ENTERING=E;h.ENTERED=R;h.EXITING=A;var Tn=function(r,a){return r&&a&&a.split(" ").forEach(function(e){return kn(r,e)})},O=function(r,a){return r&&a&&a.split(" ").forEach(function(e){return Sn(r,e)})},U=function(s){$(r,s);function r(){for(var e,t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return e=s.call.apply(s,[this].concat(n))||this,e.appliedClasses={appear:{},enter:{},exit:{}},e.onEnter=function(i,d){var c=e.resolveArguments(i,d),l=c[0],g=c[1];e.removeClasses(l,"exit"),e.addClass(l,g?"appear":"enter","base"),e.props.onEnter&&e.props.onEnter(i,d)},e.onEntering=function(i,d){var c=e.resolveArguments(i,d),l=c[0],g=c[1],x=g?"appear":"enter";e.addClass(l,x,"active"),e.props.onEntering&&e.props.onEntering(i,d)},e.onEntered=function(i,d){var c=e.resolveArguments(i,d),l=c[0],g=c[1],x=g?"appear":"enter";e.removeClasses(l,x),e.addClass(l,x,"done"),e.props.onEntered&&e.props.onEntered(i,d)},e.onExit=function(i){var d=e.resolveArguments(i),c=d[0];e.removeClasses(c,"appear"),e.removeClasses(c,"enter"),e.addClass(c,"exit","base"),e.props.onExit&&e.props.onExit(i)},e.onExiting=function(i){var d=e.resolveArguments(i),c=d[0];e.addClass(c,"exit","active"),e.props.onExiting&&e.props.onExiting(i)},e.onExited=function(i){var d=e.resolveArguments(i),c=d[0];e.removeClasses(c,"exit"),e.addClass(c,"exit","done"),e.props.onExited&&e.props.onExited(i)},e.resolveArguments=function(i,d){return e.props.nodeRef?[e.props.nodeRef.current,i]:[i,d]},e.getClassNames=function(i){var d=e.props.classNames,c=typeof d=="string",l=c&&d?d+"-":"",g=c?""+l+i:d[i],x=c?g+"-active":d[i+"Active"],Cn=c?g+"-done":d[i+"Done"];return{baseClassName:g,activeClassName:x,doneClassName:Cn}},e}var a=r.prototype;return a.addClass=function(t,n,o){var i=this.getClassNames(n)[o+"ClassName"],d=this.getClassNames("enter"),c=d.doneClassName;n==="appear"&&o==="done"&&c&&(i+=" "+c),o==="active"&&t&&hn(t),i&&(this.appliedClasses[n][o]=i,Tn(t,i))},a.removeClasses=function(t,n){var o=this.appliedClasses[n],i=o.base,d=o.active,c=o.done;this.appliedClasses[n]={},i&&O(t,i),d&&O(t,d),c&&O(t,c)},a.render=function(){var t=this.props;t.classNames;var n=_(t,["classNames"]);return m.createElement(h,mn({},n,{onEnter:this.onEnter,onEntered:this.onEntered,onEntering:this.onEntering,onExit:this.onExit,onExiting:this.onExiting,onExited:this.onExited}))},r}(m.Component);U.defaultProps={classNames:""};U.propTypes={};function V(s,r){var a=function(n){return r&&p.isValidElement(n)?r(n):n},e=Object.create(null);return s&&p.Children.map(s,function(t){return t}).forEach(function(t){e[t.key]=a(t)}),e}function Dn(s,r){s=s||{},r=r||{};function a(l){return l in r?r[l]:s[l]}var e=Object.create(null),t=[];for(var n in s)n in r?t.length&&(e[n]=t,t=[]):t.push(n);var o,i={};for(var d in r){if(e[d])for(o=0;o<e[d].length;o++){var c=e[d][o];i[e[d][o]]=a(c)}i[d]=a(d)}for(o=0;o<t.length;o++)i[t[o]]=a(t[o]);return i}function M(s,r,a){return a[r]!=null?a[r]:s.props[r]}function Bn(s,r){return V(s.children,function(a){return p.cloneElement(a,{onExited:r.bind(null,a),in:!0,appear:M(a,"appear",s),enter:M(a,"enter",s),exit:M(a,"exit",s)})})}function Pn(s,r,a){var e=V(s.children),t=Dn(r,e);return Object.keys(t).forEach(function(n){var o=t[n];if(p.isValidElement(o)){var i=n in r,d=n in e,c=r[n],l=p.isValidElement(c)&&!c.props.in;d&&(!i||l)?t[n]=p.cloneElement(o,{onExited:a.bind(null,o),in:!0,exit:M(o,"exit",s),enter:M(o,"enter",s)}):!d&&i&&!l?t[n]=p.cloneElement(o,{in:!1}):d&&i&&p.isValidElement(c)&&(t[n]=p.cloneElement(o,{onExited:a.bind(null,o),in:c.props.in,exit:M(o,"exit",s),enter:M(o,"enter",s)}))}}),t}var In=Object.values||function(s){return Object.keys(s).map(function(r){return s[r]})},Ln={component:"div",childFactory:function(r){return r}},F=function(s){$(r,s);function r(e,t){var n;n=s.call(this,e,t)||this;var o=n.handleExited.bind(yn(n));return n.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},n}var a=r.prototype;return a.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},a.componentWillUnmount=function(){this.mounted=!1},r.getDerivedStateFromProps=function(t,n){var o=n.children,i=n.handleExited,d=n.firstRender;return{children:d?Bn(t,i):Pn(t,o,i),firstRender:!1}},a.handleExited=function(t,n){var o=V(this.props.children);t.key in o||(t.props.onExited&&t.props.onExited(n),this.mounted&&this.setState(function(i){var d=mn({},i.children);return delete d[t.key],{children:d}}))},a.render=function(){var t=this.props,n=t.component,o=t.childFactory,i=_(t,["component","childFactory"]),d=this.state.contextValue,c=In(this.state.children).map(o);return delete i.appear,delete i.enter,delete i.exit,n===null?m.createElement(L.Provider,{value:d},c):m.createElement(L.Provider,{value:d},m.createElement(n,i,c))},r}(m.Component);F.propTypes={};F.defaultProps=Ln;function On(s){const{remove:r,id:a,duration:e=2e3}=s,t=p.useRef(null),n=()=>{e!==0&&(t.current=window.setTimeout(()=>{r(a),o()},e))},o=()=>{t.current&&(clearTimeout(t.current),t.current=null)};return p.useEffect(()=>(n(),()=>o()),[]),{onMouseEnter:()=>{o()},onMouseLeave:()=>{n()}}}const wn=s=>{const{onMouseEnter:r,onMouseLeave:a}=On({id:s.id,duration:s.duration,remove:s.onClose});return u.jsx("div",{style:s.style,className:"message-item",onMouseEnter:r,onMouseLeave:a,children:s.content})},xn=p.forwardRef((s,r)=>{const{messageList:a,add:e,update:t,remove:n,clearAll:o}=jn("top");"current"in r&&(r.current={add:e,update:t,remove:n,clearAll:o});const i=Object.keys(a),d=u.jsx("div",{className:"message-wrapper",children:i.map(l=>u.jsx("div",{className:`message-wrapper-${l}`,children:u.jsx(F,{children:a[l].map(g=>u.jsx(U,{timeout:1e3,classNames:"message",children:u.jsx(wn,{onClose:n,...g})},g.id))})},l))}),c=p.useMemo(()=>{const l=document.createElement("div");return l.className="wrapper",document.body.appendChild(l),l},[]);return En.createPortal(d,c)});xn.__docgenInfo={description:"",methods:[],displayName:"MessageProvider"};const vn=p.createContext({});function v(s){const{children:r}=s,a=p.useRef(null);return u.jsxs(vn.Provider,{value:{messageRef:a},children:[u.jsx(xn,{ref:a}),r]})}v.__docgenInfo={description:"",methods:[],displayName:"ConfigProvider"};function y(){const{messageRef:s}=p.useContext(vn);if(!s)throw new Error("请在最外层添加 ConfigProvider 组件");return s.current}const Fn={title:"wusj-components/Message 全局提示",parameters:{layout:"centered",docs:{description:{component:`
\`全局消息提示组件\` \`多种位置\` \`自定义样式\` \`复杂内容\` \`消息更新与关闭\` \`多条消息与清除\`

## Example Usage

1. 在应用最外层包裹 MessageConfigProvider
2. 在组件内通过 useMessage hook 获取消息控制器
3. 调用 message.add() 方法显示消息

\`\`\`jsx
// 在应用根组件
import { MessageConfigProvider } from 'wusj-components';

function App() {
  return (
    <MessageConfigProvider>
      <YourApp />
    </MessageConfigProvider>
  );
}

// 在任意组件内
import { useMessage } from './Message/useMessage';

function YourComponent() {
  const message = useMessage();
  
  const showMessage = () => {
    message.add({ content: '操作成功!' });
  };
  
  return <button onClick={showMessage}>显示消息</button>;
}
\`\`\`
`},source:{type:"code"}}},tags:["autodocs"]},k={render:()=>{const s=()=>{const r=y();return u.jsx("div",{style:{padding:"20px"},children:u.jsx(f,{onClick:()=>r.add({content:"这是一条普通消息"}),style:{marginRight:"10px"},children:"显示普通消息"})})};return u.jsx(v,{children:u.jsx(s,{})})},parameters:{docs:{source:{code:`
() => {
    const ButtonList = () => {
      const message = useMessage();
      return (
        <div style={{ padding: "20px" }}>
            <Button
            onClick={() => message.add({ content: "这是一条普通消息" })}
            style={{ marginRight: "10px" }}
            >
            显示普通消息
            </Button>
        </div>
      );
    };

    return (
      <MessageConfigProvider>
        <ButtonList />
      </MessageConfigProvider>
    );
}
`,language:"jsx",type:"auto"}}}},S={render:()=>{const s=()=>{const r=y();return u.jsxs("div",{style:{padding:"20px"},children:[u.jsx(f,{onClick:()=>r.add({content:"顶部消息",position:"top",duration:3e3}),style:{marginRight:"10px"},children:"顶部消息"}),u.jsx(f,{onClick:()=>r.add({content:"底部消息",position:"bottom",duration:3e3}),children:"底部消息"})]})};return u.jsx(v,{children:u.jsx(s,{})})}},T={render:()=>{const s=()=>{const r=y();return u.jsxs("div",{style:{padding:"20px"},children:[u.jsx(f,{onClick:()=>r.add({content:"短暂消息 (1秒)",duration:1e3}),style:{marginRight:"10px"},children:"短暂消息 (1秒)"}),u.jsx(f,{onClick:()=>r.add({content:"标准消息 (3秒)",duration:3e3}),style:{marginRight:"10px"},children:"标准消息 (3秒)"}),u.jsx(f,{onClick:()=>r.add({content:"持久消息 (不会自动关闭)",duration:0}),children:"持久消息 (不会自动关闭)"})]})};return u.jsx(v,{children:u.jsx(s,{})})}},D={render:()=>{const s=()=>{const r=y();return u.jsx("div",{style:{padding:"20px"},children:u.jsx(f,{onClick:()=>r.add({content:"自定义样式消息",style:{backgroundColor:"red",border:"1px solid #d9d9d9",borderRadius:"4px",padding:"12px 20px",fontWeight:"bold"}}),style:{marginRight:"10px"},children:"自定义样式"})})};return u.jsx(v,{children:u.jsx(s,{})})}},B={render:()=>{const s=()=>{const r=y();return u.jsxs("div",{style:{padding:"20px"},children:[u.jsx(f,{onClick:()=>r.add({content:u.jsxs("div",{children:[u.jsx("h4",{style:{margin:"0 0 8px 0"},children:"操作成功"}),u.jsx("p",{style:{margin:0},children:"数据已成功保存到数据库"})]})}),style:{marginRight:"10px"},children:"复杂内容消息"}),u.jsx(f,{onClick:()=>r.add({content:u.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[u.jsx("span",{style:{display:"inline-block",width:"16px",height:"16px",borderRadius:"50%",backgroundColor:"#52c41a",marginRight:"8px"}}),"成功消息带图标"]})}),children:"带图标消息"})]})};return u.jsx(v,{children:u.jsx(s,{})})}},P={render:()=>{const s=()=>{const r=y(),a=p.useRef(null),e=()=>{a.current||(a.current=r.add({content:"这条消息可以被更新或关闭",duration:0}))},t=()=>{a.current!==null&&r.update(a.current,{content:"消息已更新！"+new Date().toLocaleTimeString()})},n=()=>{a.current!==null&&(r.remove(a.current),a.current=null)};return u.jsxs("div",{style:{padding:"20px"},children:[u.jsx(f,{onClick:e,style:{marginRight:"10px"},children:"显示消息"}),u.jsx(f,{onClick:t,style:{marginRight:"10px"},children:"更新消息"}),u.jsx(f,{onClick:n,children:"关闭消息"})]})};return u.jsx(v,{children:u.jsx(s,{})})}},I={render:()=>{const s=()=>{const r=y(),a=()=>{r.add({content:"第一条消息",position:"top"}),r.add({content:"第二条消息",position:"top"}),r.add({content:"第三条消息",position:"bottom"})};return u.jsxs("div",{style:{padding:"20px"},children:[u.jsx(f,{onClick:a,style:{marginRight:"10px"},children:"添加多条消息"}),u.jsx(f,{onClick:()=>r.clearAll(),children:"清除所有消息"})]})};return u.jsx(v,{children:u.jsx(s,{})})}};var z,H,q;k.parameters={...k.parameters,docs:{...(z=k.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => {
    const ButtonList = () => {
      const message = useMessage();
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={() => message.add({
          content: "这是一条普通消息"
        })} style={{
          marginRight: "10px"
        }}>
            显示普通消息
          </Button>
        </div>;
    };
    return <MessageConfigProvider>
        <ButtonList />
      </MessageConfigProvider>;
  },
  parameters: {
    docs: {
      source: {
        code: \`
() => {
    const ButtonList = () => {
      const message = useMessage();
      return (
        <div style={{ padding: "20px" }}>
            <Button
            onClick={() => message.add({ content: "这是一条普通消息" })}
            style={{ marginRight: "10px" }}
            >
            显示普通消息
            </Button>
        </div>
      );
    };

    return (
      <MessageConfigProvider>
        <ButtonList />
      </MessageConfigProvider>
    );
}
\`,
        language: "jsx",
        type: "auto"
      }
    }
  }
}`,...(q=(H=k.parameters)==null?void 0:H.docs)==null?void 0:q.source}}};var J,Q,Z;S.parameters={...S.parameters,docs:{...(J=S.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => {
    const Demo = () => {
      const message = useMessage();
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={() => message.add({
          content: "顶部消息",
          position: "top",
          duration: 3000
        })} style={{
          marginRight: "10px"
        }}>
            顶部消息
          </Button>

          <Button onClick={() => message.add({
          content: "底部消息",
          position: "bottom",
          duration: 3000
        })}>
            底部消息
          </Button>
        </div>;
    };
    return <MessageConfigProvider>
        <Demo />
      </MessageConfigProvider>;
  }
}`,...(Z=(Q=S.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var K,nn,en;T.parameters={...T.parameters,docs:{...(K=T.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const Demo = () => {
      const message = useMessage();
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={() => message.add({
          content: "短暂消息 (1秒)",
          duration: 1000
        })} style={{
          marginRight: "10px"
        }}>
            短暂消息 (1秒)
          </Button>

          <Button onClick={() => message.add({
          content: "标准消息 (3秒)",
          duration: 3000
        })} style={{
          marginRight: "10px"
        }}>
            标准消息 (3秒)
          </Button>

          <Button onClick={() => message.add({
          content: "持久消息 (不会自动关闭)",
          duration: 0
        })}>
            持久消息 (不会自动关闭)
          </Button>
        </div>;
    };
    return <MessageConfigProvider>
        <Demo />
      </MessageConfigProvider>;
  }
}`,...(en=(nn=T.parameters)==null?void 0:nn.docs)==null?void 0:en.source}}};var tn,sn,rn;D.parameters={...D.parameters,docs:{...(tn=D.parameters)==null?void 0:tn.docs,source:{originalSource:`{
  render: () => {
    const Demo = () => {
      const message = useMessage();
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={() => message.add({
          content: "自定义样式消息",
          style: {
            backgroundColor: "red",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            padding: "12px 20px",
            fontWeight: "bold"
          }
        })} style={{
          marginRight: "10px"
        }}>
            自定义样式
          </Button>
        </div>;
    };
    return <MessageConfigProvider>
        <Demo />
      </MessageConfigProvider>;
  }
}`,...(rn=(sn=D.parameters)==null?void 0:sn.docs)==null?void 0:rn.source}}};var on,an,dn;B.parameters={...B.parameters,docs:{...(on=B.parameters)==null?void 0:on.docs,source:{originalSource:`{
  render: () => {
    const Demo = () => {
      const message = useMessage();
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={() => message.add({
          content: <div>
                    <h4 style={{
              margin: "0 0 8px 0"
            }}>操作成功</h4>
                    <p style={{
              margin: 0
            }}>数据已成功保存到数据库</p>
                  </div>
        })} style={{
          marginRight: "10px"
        }}>
            复杂内容消息
          </Button>

          <Button onClick={() => message.add({
          content: <div style={{
            display: "flex",
            alignItems: "center"
          }}>
                    <span style={{
              display: "inline-block",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#52c41a",
              marginRight: "8px"
            }}></span>
                    成功消息带图标
                  </div>
        })}>
            带图标消息
          </Button>
        </div>;
    };
    return <MessageConfigProvider>
        <Demo />
      </MessageConfigProvider>;
  }
}`,...(dn=(an=B.parameters)==null?void 0:an.docs)==null?void 0:dn.source}}};var cn,un,ln;P.parameters={...P.parameters,docs:{...(cn=P.parameters)==null?void 0:cn.docs,source:{originalSource:`{
  render: () => {
    const Demo = () => {
      const message = useMessage();
      const messageIdRef = useRef<number | null>(null);
      const showMessage = () => {
        if (messageIdRef.current) return;
        messageIdRef.current = message.add({
          content: "这条消息可以被更新或关闭",
          duration: 0
        });
      };
      const updateMessage = () => {
        if (messageIdRef.current !== null) {
          message.update(messageIdRef.current, {
            content: "消息已更新！" + new Date().toLocaleTimeString()
          });
        }
      };
      const closeMessage = () => {
        if (messageIdRef.current !== null) {
          message.remove(messageIdRef.current);
          messageIdRef.current = null;
        }
      };
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={showMessage} style={{
          marginRight: "10px"
        }}>
            显示消息
          </Button>

          <Button onClick={updateMessage} style={{
          marginRight: "10px"
        }}>
            更新消息
          </Button>

          <Button onClick={closeMessage}>关闭消息</Button>
        </div>;
    };
    return <MessageConfigProvider>
        <Demo />
      </MessageConfigProvider>;
  }
}`,...(ln=(un=P.parameters)==null?void 0:un.docs)==null?void 0:ln.source}}};var pn,gn,fn;I.parameters={...I.parameters,docs:{...(pn=I.parameters)==null?void 0:pn.docs,source:{originalSource:`{
  render: () => {
    const Demo = () => {
      const message = useMessage();
      const addMultipleMessages = () => {
        message.add({
          content: "第一条消息",
          position: "top"
        });
        message.add({
          content: "第二条消息",
          position: "top"
        });
        message.add({
          content: "第三条消息",
          position: "bottom"
        });
      };
      return <div style={{
        padding: "20px"
      }}>
          <Button onClick={addMultipleMessages} style={{
          marginRight: "10px"
        }}>
            添加多条消息
          </Button>

          <Button onClick={() => message.clearAll()}>清除所有消息</Button>
        </div>;
    };
    return <MessageConfigProvider>
        <Demo />
      </MessageConfigProvider>;
  }
}`,...(fn=(gn=I.parameters)==null?void 0:gn.docs)==null?void 0:fn.source}}};const Gn=["Basic","MessagePosition","CustomDuration","CustomStyle","ComplexContent","UpdateAndClose","MultipleMessages"];export{k as Basic,B as ComplexContent,T as CustomDuration,D as CustomStyle,S as MessagePosition,I as MultipleMessages,P as UpdateAndClose,Gn as __namedExportsOrder,Fn as default};
