import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = 'modules/index.js';
const globalName = 'ReactMedia';
const globals = { react: 'React' };

function external(id) {
  return !id.startsWith('.') && !id.startsWith('/');
}

const cjs = [
  {
    input,
    output: { file: `cjs/${pkg.name}.js`, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      babel({ exclude: /node_modules/, babelHelpers: 'bundled' }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },

  {
    input,
    output: { file: `cjs/${pkg.name}.min.js`, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      babel({ exclude: /node_modules/, babelHelpers: 'bundled' }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser()
    ]
  }
];

const esm = [
  {
    input,
    output: { file: `esm/${pkg.name}.js`, format: 'esm', exports: 'named' },
    external,
    plugins: [
      babel({
        exclude: /node_modules/,
        babelHelpers: 'runtime',
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      sizeSnapshot()
    ]
  }
];

const umd = [
  {
    input,
    output: {
      file: `umd/${pkg.name}.js`,
      format: 'umd',
      name: globalName,
      exports: 'named',
      globals
    },
    external: Object.keys(globals),
    plugins: [
      babel({
        exclude: /node_modules/,
        babelHelpers: 'runtime',
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot()
    ]
  },

  {
    input,
    output: {
      file: `umd/${pkg.name}.min.js`,
      format: 'umd',
      name: globalName,
      exports: 'named',
      globals
    },
    external: Object.keys(globals),
    plugins: [
      babel({
        exclude: /node_modules/,
        babelHelpers: 'runtime',
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(),
      terser()
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs;
    break;
  case 'esm':
    config = esm;
    break;
  case 'umd':
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

export default config;
