import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/ops.js',
  output: [
    {
      file: 'dist/ops.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/ops.es.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    resolve(),
    commonjs()
  ]
}
