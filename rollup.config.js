import copy from 'rollup-plugin-copy';
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  injectServiceWorker: true,
  nodeResolve: true,
  babel: true,
  terser: true,
  html: true,
  polyfillsLoader: true,
  workbox: true,
});

export default merge(baseConfig, {
  input: 'index.html',

  preserveEntrySignatures: false,

  plugins: [
    copy({
      targets: [{ src: 'assets/*', dest: './dist' }],
    }),
  ],
});
