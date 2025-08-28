import fs from 'node:fs'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import { defineConfig } from 'vite'
import entry from './components.json'

const utilsList = fs.readdirSync(path.resolve(__dirname, './src/utils'))
const mixinsList = fs.readdirSync(path.resolve(__dirname, './src/mixins'))
const transitionList = fs.readdirSync(path.resolve(__dirname, './src/transitions'))
let externals: Record<string, string> = {}

Object.keys(entry).forEach((key) => {
  externals[`element-ui/packages/${key}`] = `element-ui/lib/${key}`
})

externals['element-ui/src/locale'] = 'element-ui/lib/locale'
utilsList.forEach((file) => {
  file = path.basename(file, '.js')
  externals[`element-ui/src/utils/${file}`] = `element-ui/lib/utils/${file}`
})
mixinsList.forEach((file) => {
  file = path.basename(file, '.js')
  externals[`element-ui/src/mixins/${file}`] = `element-ui/lib/mixins/${file}`
})
transitionList.forEach((file) => {
  file = path.basename(file, '.js')
  externals[`element-ui/src/transitions/${file}`] = `element-ui/lib/transitions/${file}`
})

// externals = [Object.assign({
//   vue: 'vue',
// }, externals)]

export default defineConfig({
  resolve: {
    alias: {
      'element-ui': path.resolve(import.meta.dirname),
      // ...externals,
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: {
        ...entry,
        index: path.resolve(import.meta.dirname, 'src/index.js'),
      },
    },
    rollupOptions: {
      external: ['vue', ...Object.keys(externals)],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        paths: {
          ...externals,
        },
        // interop: 'default',
      },
    },
    minify: false,
  },
})
