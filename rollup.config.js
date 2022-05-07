import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import html from '@web/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: true,
      injectServiceWorker: false,
      // serviceWorkerPath: 'dist/sw.js',
      strictCSS: true,
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS */
    terser(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: [
              'last 3 Chrome major versions',
              'last 3 Firefox major versions',
              'last 3 Edge major versions',
              'last 3 Safari major versions',
            ],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    copy({
      targets: [
        { src: 'assets/icon-192.png', dest: 'dist/assets' },
        { src: 'assets/apple-touch-icon.png', dest: 'dist' },
        { src: 'assets/favicon.ico', dest: 'dist' },
        { src: 'assets/icon.svg', dest: 'dist' },
        { src: 'assets/_headers', dest: 'dist' },
        { src: 'assets/_redirects', dest: 'dist' },
        { src: 'assets/404.html', dest: 'dist' },
        { src: 'assets/success.html', dest: 'dist' },
        { src: 'assets/images/*', dest: 'dist/assets/images' },
      ],
    }),
  ],
};
