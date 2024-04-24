import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import vue from '@vitejs/plugin-vue';
import html from '@rollup/plugin-html';
import ts from 'rollup-plugin-typescript2';
import fixedTs from 'rollup-plugin-typescript2-fixed';
import chalk from 'chalk';

const isProduction = process.env.NODE_ENV === 'production';
const watchMode = process.env.ROLLUP_WATCH === 'true';

const log = (...msgs) => console.log('🚧 ', ...msgs);

const transformLog = (logPrefix = '') => {
  return {
    name: 'transform-log',
    transform(code, id) {
      if (
        watchMode &&
        !id.includes('node_modules') &&
        !id.startsWith('\x00') &&
        id.endsWith('.ts')
      ) {
        log(chalk.yellow.bold(logPrefix), { id, code });
      }
      return code;
    },
  };
};

export default (args) => {
  const useFixedTS = args.useFixedTS;
  delete args.useFixedTS;

  const rpt2Opts = { verbosity: 2 };

  log(chalk.yellow.bold(`Using ${useFixedTS ? 'fixed' : 'original'} rpt2.`));

  return defineConfig({
    input: 'src/main.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'esm',
    },
    plugins: [
      resolve(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': process.env.NODE_ENV
            ? JSON.stringify(process.env.NODE_ENV)
            : JSON.stringify('development'),
          __VUE_OPTIONS_API__: false,
          __VUE_PROD_DEVTOOLS__: !isProduction,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: !isProduction,
        },
      }),

      transformLog('Before ts'),
      useFixedTS ? fixedTs(rpt2Opts) : ts(rpt2Opts),
      transformLog('After ts'),

      vue({ isProduction }),
      html({ title: 'Rollup with Vue 3 & TS & Watch mode' }),
    ],
    watch: {
      clearScreen: false,
    },
  });
};
