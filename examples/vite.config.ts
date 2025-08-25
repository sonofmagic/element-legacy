import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            'element-ui': path.resolve(import.meta.dirname, '..'),
            'main': path.resolve(import.meta.dirname, '../src')
        }
    },
    plugins: [
        Vue(),
        VueJsx()
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