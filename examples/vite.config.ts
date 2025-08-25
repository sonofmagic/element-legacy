import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import path from 'path'
import Markdown from 'unplugin-vue-markdown/vite'

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
            vueVersion: '2.7'
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