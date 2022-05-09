// import html from '@rollup/plugin-html';
import htmlWeb from '@web/rollup-plugin-html';

import { copy } from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default {
  plugins: [
    /** Enable using HTML as rollup entrypoint */
    htmlWeb({
      input: 'index.html',
      strictCSPInlineScripts: true,
      //  transformHtml: [html => html.replace('_NONCE_HERE_', 'nonce-'.concat())],
    }),
    //   html({
    //     meta: [
    //       { charset: 'utf-8' },
    //       {
    //         name: 'viewport',
    //         content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
    //       },
    //       {
    //         name: 'Description',
    //         content: 'Pleased to meet you. よろしくお願いします。',
    //       },
    //       {
    //         'http-equiv': 'Content-Security-Policy',
    //         content:
    //           "default-src 'none'; img-src 'self'; script-src https://d33wubrfki0l68.cloudfront.net; style-src https://d33wubrfki0l68.cloudfront.net; manifest-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    //       },
    //     ],
    //   }),
    /** Resolve bare module imports */
    resolve(),
    // Minify HTML template literals
    minifyHTML(),
    /** Minify JS */
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    copy({
      patterns: '**/*headshot.jpg',
    }),
    copy({
      patterns: '**/*',
      rootDir: './assets',
    }),
  ],
  output: { dir: 'dist' },
  preserveEntrySignatures: false,
};
