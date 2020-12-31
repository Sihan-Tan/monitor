import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const extensions = [''];
const noDeclarationFiles = {
  compilerOptions: {
    declaration: false,
  },
};
const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
);

// 除去不需要参与打包的模块
const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

export default [
  // commonjs
  {
    input: 'src/index.ts',
    output: [{
      file: 'lib/kangaroo-monitor.js',
      format: 'cjs',
      indent: false,
    }],
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),
      json(),
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        extensions,
        plugins: [
          ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
        ],
        runtimeHelpers: true,
      }),
    ],
  },
  // ES
  {
    input: 'src/index.ts',
    output: [
      { file: 'es/kangaroo-monitor.js', format: 'es', indent: false },
      { file: '../GreenValley/admin/src/kangaroo-monitor.js', format: 'es', indent: false }
    ],
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),
      json(),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            { version: babelRuntimeVersion, useESModules: true },
          ],
        ],
        runtimeHelpers: true,
      }),
    ],
  },
  // ES for Browsers
  {
    input: 'src/index.ts',
    output: { file: 'es/kangaroo-monitor.mjs', format: 'es', indent: false },
    plugins: [
      nodeResolve({
        extensions,
      }),
      json(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
  // UMD Development
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/kangaroo-monitor.js',
        format: 'umd',
        name: 'KangarooMonitor',
        indent: false,
      },
      {
        file: 'examples/kangaroo-monitor.js',
        format: 'umd',
        name: 'KangarooMonitor',
        indent: false,
      }
    ],
    plugins: [
      nodeResolve({
        extensions,
      }),
      json(),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },

  // UMD Production
  {
    input: 'src/index.ts',
    output: {
        file: 'dist/kangaroo-monitor.min.js',
        format: 'umd',
        name: 'KangarooMonitor',
        indent: false,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      json(),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
];
