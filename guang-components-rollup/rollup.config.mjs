import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

/** @type {import("rollup").RollupOptions} */
export default {
    input: 'src/index.ts',
    treeshake: true, // 摇树优化（默认开启）
    external: [ 'react', 'react-dom' ], // 外部依赖（不打包进bundle）
    output: [
        {
            file: 'dist/esm.js',
            format: 'esm',
        },
        {
            file: 'dist/cjs.js',
            format: "cjs"
        },
        {
            file: 'dist/umd.js',
            name: 'WSJ',
            format: "umd",
            // 即使ts中指定了jsx为react-jsx，但是实际运行并没有报错
            // 因为rollup智能的内联了必要的 JSX Runtime 代码
            // 即使实在没有引入react/jsx-runtime，也会实现个兼容层，比如：
            // var jsx = function(type, props) {
            //   return React.createElement(type, props);
            // };
            // 这样实际运行转换后的umd代码，只要全局引入了React，就不会报错
            globals: {
                'react': 'React',
                'react-dom': 'ReactDOM'
            }
        }
    ],
    plugins: [
        resolve(), // 解析第三方模块路径
        commonjs(), // 将 CommonJS 模块转换为 ES 模块（因为rollup只支持es模块）
        typescript({ // 编译ts代码（转换）
            tsconfig: 'tsconfig.json',
            exclude: [
                "src/**/*.test.tsx",
                "src/**/*.stories.tsx"
            ]
        }),
        postcss({ // 处理css，样式合并+抽取
            extract: true, // 不加的话，样式会直接内联到js中，通过js注入style标签
            extract: 'index.css'
        }),
        replace({ // 全局替换环境变量
            'process.env.NODE_ENV': '"production"'
        })
    ]
};
