import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import path from 'path'
import Markdown from 'unplugin-vue-markdown/vite'
import markdownItContainer from 'markdown-it-container'

export default defineConfig({
    resolve: {
        alias: {
            'element-ui': path.resolve(import.meta.dirname, '..'),
            'main': path.resolve(import.meta.dirname, '../src')
        }
    },
    plugins: [
        Vue(
            {
                include: [/\.vue$/, /\.md$/],
            }
        ),
        VueJsx(),
        Markdown({
            vueVersion: '2.7',
            markdownItSetup(md) {
                md.use(markdownItContainer, 'demo', {
                    validate(params) {
                        return params.trim().match(/^demo\s*(.*)$/)
                    },
                    render(tokens, idx) {
                        const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)

                        if (tokens[idx].nesting === 1) {
                            // 容器开始
                            const description = m && m.length > 1 ? m[1] : ''
                            const nextIndex = idx + 1
                            const codeToken = tokens[nextIndex]

                            // 从 tokens 中获取源码字符串
                            let sourceCode = ''
                            if (codeToken.type === 'fence' && codeToken.info.trim().startsWith('vue')) {
                                sourceCode = codeToken.content
                            }

                            // 传给 Demo 组件
                            const escaped = sourceCode
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/`/g, '&#96;')

                            return `<Demo source="${JSON.stringify(escaped)}" description="${description}">\n`
                        } else {
                            // 容器结束
                            return '</Demo>\n'
                        }
                    }
                })
            }
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'legacy-js-api', 'color-functions', 'new-global', 'global-builtin', 'import'],
            },
        },
    },
})