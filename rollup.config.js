// import nodeRes from '@rollup/plugin-node-resolve';
// import { threeMinifier } from '@yushijinhun/three-minifier-rollup';
// import bab from '@rollup/plugin-babel';
// import html from '@web/rollup-plugin-html';
// import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
// import { terser } from 'rollup-plugin-terser';
// import { generateSW } from 'rollup-plugin-workbox';
// import path from 'path';
import copy from 'rollup-plugin-copy';
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

// const merge = require('deepmerge');
// const typescript = require('@rollup/plugin-typescript');

// const { createSpaConfig } = require('../../index.js');

// const { createSpaConfig } = require('./src/createSpaConfig');

const baseConfig = createSpaConfig({
  injectServiceWorker: true,
  nodeResolve: true,
  babel: true,
  terser: true,
  html: true,
  polyfillsLoader: true,
  workbox: true,
});

// module.exports = merge(baseConfig, {
//   input: 'index.html',
//   plugins: [typescript({ experimentalDecorators: true, target: 'es2019' })],
// });

export default merge(baseConfig, {
  input: 'index.html',

  preserveEntrySignatures: false,

  plugins: [
    copy({
      targets: [{ src: 'assets/*', dest: './dist' }],
      // set flatten to false to preserve folder structure
      //  flatten: false,
    }),
  ],
});
