import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'build/bundles/bundle.esm.js',
      format: 'esm',
      sourcemap: true,
      globals: {}
    },
    {
      file: 'build/bundles/bundle.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
      globals: {}
    },
    {
      file: 'build/bundles/bundle.umd.js',
      format: 'umd',
      name: 'logger',
      sourcemap: true,
      globals: {}
    },
    {
      file: 'build/bundles/bundle.umd.min.js',
      format: 'umd',
      plugins: [terser()],
      name: 'logger',
      sourcemap: true,
      globals: {}
    }
  ],
  plugins: [
    resolve({ extensions: ['.js'] }),
    babel({ babelHelpers: 'bundled', include: ['src/**/*.js'], extensions: ['.js'], exclude: './node_modules/**' })
  ]
};
