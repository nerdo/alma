import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import pkg from './package.json'

const plugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**'
  })
]

export default [
  // Main alma library.
  {
    input: 'src/alma.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins
  },

  // Testing conveniences.
  {
    input: 'src/testing.js',
    output: [
      {
        file: 'dist/testing.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/testing.es.js',
        format: 'es',
        sourcemap: true
      }
    ],
    external: [
      'implements-interface'
    ],
    plugins
  }
]
