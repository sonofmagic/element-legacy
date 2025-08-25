import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import entry from './components.json'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            'element-ui': path.resolve(import.meta.dirname)
        }
    },
    plugins: [
        Vue(),
        VueJsx()
    ],
    build: {
        outDir: 'lib',
        lib: {
            entry:{
                ...entry,
                index: path.resolve(import.meta.dirname, 'src/index.js')
            }
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                },
            },
        }
    }
})