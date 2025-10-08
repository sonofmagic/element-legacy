import path from 'node:path'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import markdownItContainer from 'markdown-it-container'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'element-ui': path.resolve(import.meta.dirname, '..'),
      'main': path.resolve(import.meta.dirname, '../src'),
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
        md.use(markdownItContainer, 'demo', {
          validate(params) {
            return params.trim().startsWith('demo')
          },
          render(tokens, idx) {
            const info = tokens[idx].info.trim()
            const firstSpaceIndex = info.indexOf(' ')
            const hasDescription = firstSpaceIndex !== -1
            const descriptionText = hasDescription ? info.slice(firstSpaceIndex + 1).trim() : ''

            if (tokens[idx].nesting === 1) {
              let sourceCode = ''
              let fenceIndex = idx + 1

              while (fenceIndex < tokens.length) {
                const token = tokens[fenceIndex]
                if (token.type === 'fence') {
                  sourceCode = token.content
                  break
                }
                if (token.type === 'container_demo_close') {
                  break
                }
                fenceIndex++
              }

              const encodedSource = encodeURIComponent(sourceCode)
              const renderedDescription = descriptionText ? md.render(descriptionText) : ''
              const encodedDescription = encodeURIComponent(renderedDescription)

              return `<Demo source="${encodedSource}" description="${encodedDescription}">\n`
            }
            return '</Demo>\n'
          },
        })
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
