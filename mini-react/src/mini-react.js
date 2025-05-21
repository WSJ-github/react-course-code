(function() {
    /**
     * 创建react element(即vdom)
     * @param {*} type 函数（函数组件）或 html标签字符串
     * @param {*} props 属性
     * @param {*} children 子节点
     * @returns 
     */
    function createElement(type, props, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children.map((child) => {
                    const isTextNode = typeof child === "string" || typeof child === "number";
                    return isTextNode ? createTextNode(child) : child;
                }),
            },
        };
    }
    
    /**
     * 创建vdom文本节点
     * @param {*} nodeValue 
     * @returns 
     */
    function createTextNode(nodeValue) {
        return {
            type: "TEXT_ELEMENT",
            props: {
                nodeValue,
                children: []
            },
        };
    }
    
    let nextUnitOfWork = null
    let wipRoot = null // 即将处理的fiber树（可能是根fiber节点，也可能是某个状态改变触发rerender的fiber节点）
    let currentRoot = null // 首轮处理完后的fiber根节点（从根节点可以遍历完整条fiber链）
    let deletions = null
    
    /**
     * 
     * @param {*} element  react element(vdom，即createElement的返回值)
     * @param {*} container  dom element(真实dom节点)
     */
    function render(element, container) {
        wipRoot = { // 当前准备处理的(类)fiber节点 -- 根fiber节点
            dom: container,
            props: {
                children: [element],
            },
            alternate: currentRoot, // 旧的fiber树（链）对应的根节点
        }
        
        deletions = [] // 需要删除的fiber节点列表
    
        nextUnitOfWork = wipRoot // 下一个工作单元（每个工作单元对应一个fiber节点）
    }
    
    /**
     * schedule：调度器
     * 
     * 每次处理一个(类)fiber节点
     * 浏览器空闲时执行workLoop
     * @param {*} deadline 
     */
    function workLoop(deadline) {
        let shouldYield = false // 是否需要暂停
        while (nextUnitOfWork && !shouldYield) {
            nextUnitOfWork = performUnitOfWork(
                nextUnitOfWork
            )
            // 如果当前剩余闲置时间小于1ms，则暂停，等待后续调度
            // 否则继续处理下一个fiber节点
            shouldYield = deadline.timeRemaining() < 1
        }
    
        // 所有fiber节点都处理完了，则进入commit阶段
        if (!nextUnitOfWork && wipRoot) {
            commitRoot()
        }
    
        requestIdleCallback(workLoop)
    }
    
    requestIdleCallback(workLoop) // 浏览器空闲时执行 workLoop
    
    /**
     * 处理一个(类)fiber节点，并且返回下一个工作单元（即下一个要处理的fiber节点）
     * 
     * 返回的fiber节点优先级：
     * 1. 有子节点，返回子节点
     * 2. 没有子节点，返回兄弟节点
     * 3. 没有兄弟节点，返回父节点继续循环找兄弟节点
     * @param {*} fiber 
     * @returns 
     */
    function performUnitOfWork(fiber) {
        const isFunctionComponent = fiber.type instanceof Function
        if (isFunctionComponent) { // 函数式组件
            updateFunctionComponent(fiber)
        } else { // html标签
            updateHostComponent(fiber)
        }
        if (fiber.child) { // 有子节点（应该说是第一个子节点），返回子节点 --- 1
            return fiber.child
        }
        let nextFiber = fiber
        while (nextFiber) {
            if (nextFiber.sibling) { // 有兄弟节点，返回兄弟节点 --- 2
                return nextFiber.sibling
            }
            nextFiber = nextFiber.return // 回溯，没有兄弟节点，返回父节点继续找兄弟节点 --- 3
        }
    }
    
    let wipFiber = null
    let stateHookIndex = null
    
    /**
     * 函数式组件fiber节点处理
     * 1. 给当前占位符节点设置state和effect钩子列表
     * 2. 传入占位符节点上的props，执行函数式组件，返回子vdom节点
     * 3. 协调：将子vdom节点 转-> fiber节点
     * @param {*} fiber 
     */
    function updateFunctionComponent(fiber) {
      wipFiber = fiber // 当前fiber，TODO: 类似于vue的$vnode，占位符节点
      stateHookIndex = 0 // 当前fiber节点的state索引

      // 证实了函数式组件的state和effect是维护在fiber节点上的
      wipFiber.stateHooks = [] // 当前fiber节点的state钩子列表
      wipFiber.effectHooks = [] // 当前fiber节点的effect钩子列表
    
      // 执行函数式组件，返回子vdom节点，返回的肯定是单节点（起码包一层React.Fragment）
      const children = [fiber.type(fiber.props)]
      reconcileChildren(fiber, children)
    }
    
    /**
     * 对type为html标签的fiber节点进行处理
     * @param {*} fiber 
     */
    function updateHostComponent(fiber) {
        if (!fiber.dom) {
            fiber.dom = createDom(fiber)
        }
        // 当前fiber节点作为父节点，协调子节点
        reconcileChildren(fiber, fiber.props.children)
    }
    
    /**
     * 根据fiber节点的类型（其实也就是vdom的类型），创建真实dom节点
     */
    function createDom(fiber) {
        const dom =
          fiber.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)
      
        updateDom(dom, {}, fiber.props)
      
        return dom
    }
    
    const isEvent = key => key.startsWith("on")
    const isProperty = key => key !== "children" && !isEvent(key)
    const isNew = (prev, next) => key => prev[key] !== next[key]
    const isGone = (prev, next) => key => !(key in next)
    
    /**
     * 更新dom节点属性
     * @param {*} dom 真实dom节点
     * @param {*} prevProps 旧fiber节点上的props
     * @param {*} nextProps 新fiber节点上的props
     */
    function updateDom(dom, prevProps, nextProps) {
      //Remove old or changed event listeners
      Object.keys(prevProps)
        .filter(isEvent)
        .filter(
          key => !(key in nextProps) || isNew(prevProps, nextProps)(key)
        )
        .forEach(name => {
          const eventType = name.toLowerCase().substring(2)
          dom.removeEventListener(eventType, prevProps[name])
        })
    
      // Remove old properties
      Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
          dom[name] = ""
        })
    
      // Set new or changed properties
      Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
          dom[name] = nextProps[name]
        })
    
      // Add event listeners
      Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
          const eventType = name.toLowerCase().substring(2)
          dom.addEventListener(eventType, nextProps[name])
        })
    }
      
    /**
     * 【协调】
     * 
     * 类似于vue的patch vnode->实例 的过程
     * 
     * vdom结构 -转-> fiber结构
     * 
     * react diff就在这里面完成
     * TODO:：但是感觉算法好像不太智能，可能跟架构本身的关系，如果同一父节点中的子节点调整位置，好像就复用不了了，全走“PLACEMENT”了
     * 实际框架中应该是用key和当前oldFiber去做diff比较，从elements中筛出可以复用的部分，而不是位置不对就直接替换了？
     * @param {*} wipFiber 父fiber节点
     * @param {*} elements 子节点，react element（vdom）列表
     */
    function reconcileChildren(wipFiber, elements) {
        let index = 0
        let oldFiber = wipFiber.alternate?.child
        let prevSibling = null
    
        while ( index < elements.length || oldFiber != null) {
            const element = elements[index]
            let newFiber = null
    
            const sameType = element?.type == oldFiber?.type // TODO: 旧fiber节点 和 对应新的vdom节点 比较，他们的type取的是同一个东西
    
            // 如果类型相同，复用fiber节点
            if (sameType) {
                // 即使是更新阶段，每个fiber节点也都是新的，只是旧fiber节点中的内容会被复用
                newFiber = {
                    type: oldFiber.type,
                    props: element.props,
                    dom: oldFiber.dom, // dom节点复用
                    return: wipFiber,
                    alternate: oldFiber, // 新旧fiber 对应关联上
                    effectTag: "UPDATE", // 标识为更新
                }
            }
            // 如果类型不同，创建新的fiber节点
            if (element && !sameType) {
                newFiber = {
                    type: element.type,
                    props: element.props,
                    dom: null,
                    return: wipFiber, // 指向父fiber节点
                    alternate: null,
                    effectTag: "PLACEMENT", // 标识为新增
                }
            }
            if (oldFiber && !sameType) {
                oldFiber.effectTag = "DELETION" // 老fiber节点标识为删除
                deletions.push(oldFiber) // 收集要被删除的旧fiber节点进待删除列表
            }
    
            if (oldFiber) {
                oldFiber = oldFiber.sibling
            }
    
            if (index === 0) {
                wipFiber.child = newFiber // 给父fiber节点 关联child 子fiber节点
            } else if (element) {
                prevSibling.sibling = newFiber // 给兄弟fiber节点 关联sibling 兄弟fiber节点
            }
    
            prevSibling = newFiber
            index++
        }
    }
    
    function useState(initialState) {
        // 用一个局部变量来保存当前调用useState的fiber节点，后续闭包到setState中
        const currentFiber = wipFiber;

        const oldHook = wipFiber.alternate?.stateHooks[stateHookIndex];

        const stateHook = {
          state: oldHook ? oldHook.state : initialState,
          queue: oldHook ? oldHook.queue : [],
        };
        
        stateHook.queue.forEach((action) => {
          stateHook.state = action(stateHook.state);
        });

        stateHook.queue = [];

        stateHookIndex++;
        wipFiber.stateHooks.push(stateHook);

        function setState(action) {
          const isFunction = typeof action === "function";
          // 如果传入的是函数，那么先存起来
          stateHook.queue.push(isFunction ? action : () => action);

          // 当前fiber节点相关状态发生改变，需rerender
          wipRoot = {
            // 为什么用currentFiber而不是wipFiber，因为currentFiber是local级局部变量，wipFiber是相对全局的局部变量会一直变
            ...currentFiber,
            alternate: currentFiber,
          };

          // 渲染完首轮fiber链之后，requestIdleCallback(workLoop)还是会一直执行，直到wipRoot & nextUnitOfWork有值，就以这个fiber节点作为当前根节点递归更新所有子节点
          nextUnitOfWork = wipRoot;
        }
      
        return [stateHook.state, setState];
    }
    
    function useEffect(callback, deps) {
      const effectHook = {
        callback,
        deps,
        // TODO:思考：<1>
        // 这里好像没有处理 rerender过程中 alternate节点cleanup函数的持久态
        // 因为在commitRoot阶段当前effect不被执行，那么后续就没办法触发上次渲染时 alternate节点执行时保留的cleanup函数了，因为拿不到了
        // 解决方法：如果旧fiber节点的订阅没有被取消，试图在commitRoot阶段保留该订阅的卸载函数
        cleanup: undefined,
      };
      wipFiber.effectHooks.push(effectHook);
    }
    
    /**
     * TODO:
     * 所有vdom节点都转成对应fiber链的形式，fiber链表已构造完成
     * dfs递归处理fiber链
     */
    function commitRoot() {
        deletions.forEach(commitWork) // 递归处理要删除的fiber节点（移除dom节点与父dom之间的关联）
        commitWork(wipRoot.child) // 递归处理子节点（为链上dom节点建立关联），根据fiber节点的类型做相对应处理
        commitEffectHooks() // 处理effect钩子
        currentRoot = wipRoot // 更新当前根fiber节点树（链）
        wipRoot = null // 重置wipRoot
        deletions = [] // 重置deletions
    }
    
    // TODO: 核心（处理fiber链）
    function commitWork(fiber) {
        if (!fiber) {
            return
        }
    
        let domParentFiber = fiber.return
        while (!domParentFiber.dom) {
            domParentFiber = domParentFiber.return
        }
        const domParent = domParentFiber.dom
    
        if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
            domParent.appendChild(fiber.dom)
        } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
            updateDom(fiber.dom, fiber.alternate.props, fiber.props) // fiber节点复用，说明对应dom节点也会复用，这里是去更新该dom节点属性
        } else if (fiber.effectTag === "DELETION") {
            commitDeletion(fiber, domParent)
            
            // <2>
            // 感觉这里应该直接return，因为所有fiber的复用和是否删除应该在diff，即reconcile阶段就确定的了
            // 如果需要删除，那么所有需要删除链接的节点都会被装入deletions列表，而不需要下面递归去判断子节点和兄弟节点
            // 而且从始至终都没有发现有对即将删除的oldfiber系列child做处理，effectTag也没改，所以意味着这个要删除节点的子节点的effectTag属性还是“PLACEMENT”
            // 因此我觉得这里没必要王再执行了
            return
        }
    
        commitWork(fiber.child) // 递归处理子节点
        commitWork(fiber.sibling) // 递归处理兄弟节点
    }
    
    function commitDeletion(fiber, domParent) {
        if (fiber.dom) {
            domParent.removeChild(fiber.dom)
        } else {
            commitDeletion(fiber.child, domParent)
        }
    }
    
    function isDepsEqual(deps, newDeps) {
        if(deps.length !== newDeps.length) {
            return false;
        }
    
        for(let i = 0; i < deps.length; i++) {
            if(deps[i] !== newDeps[i]) {
                return false;
            }
        }
        return true;
    }
    
    function commitEffectHooks() {
        function runCleanup(fiber){
            if (!fiber) return;
    
            fiber.alternate?.effectHooks?.forEach((hook, index)=>{
                const deps = fiber.effectHooks[index].deps;
    
                if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
                    hook.cleanup?.();
                    
                    hook.cleanup = undefined // <1> 
                }
            })
    
            runCleanup(fiber.child);
            runCleanup(fiber.sibling);
        }
    
        function run(fiber) {
            if (!fiber) return;

            const oldEffectHooks = fiber.alternate?.effectHooks // <1>
      
            fiber.effectHooks?.forEach((newHook, index) => {
                if(!fiber.alternate) {
                    newHook.cleanup = newHook.callback();
                    return;
                }
    
                if(!newHook.deps) {
                    newHook.cleanup = newHook.callback();
                }
    
                if (newHook.deps.length > 0) {
                    const oldHook = fiber.alternate?.effectHooks[index];

                    if(!isDepsEqual(oldHook.deps, newHook.deps)) {
                        newHook.cleanup = newHook.callback()
                    }
                }
                if(oldEffectHooks?.[index]?.cleanup && !newHook.cleanup) // <1>
                    newHook.cleanup = oldEffectHooks[index].cleanup
            });
    
            run(fiber.child);
            run(fiber.sibling);
        }
      
        runCleanup(wipRoot); // 递归 执行旧effect订阅清除函数
        run(wipRoot); // 递归 执行所有fiber节点种收录的effect函数
    }
    
    const MiniReact = {
        createElement,
        render,
        useState,
        useEffect
    };
    
    window.MiniReact = MiniReact;
})();

