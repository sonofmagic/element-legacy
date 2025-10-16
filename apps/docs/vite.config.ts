import path from 'node:path'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import { setupMarkdownContainers } from './markdown/setup'

export default defineConfig({
  resolve: {
    alias: {
      'element-ui': path.resolve(import.meta.dirname, '../ui'),
      'main': path.resolve(import.meta.dirname, '../ui/src'),
    },
  },
  plugins: [
    Vue(
      {
        include: [/\.vue$/, /\.md$/],
      },
    ),
    VueJsx(),
    Markdown({
      vueVersion: '2.7',
      markdownItSetup(md) {
        setupMarkdownContainers(md)
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'legacy-js-api',
          'color-functions',
          'new-global',
          'global-builtin',
          'import',
        ],
      },
    },
  },
})
