import html from '@web/rollup-plugin-html';
import { copy } from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default {
  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      input: 'index.html',
    }),
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
