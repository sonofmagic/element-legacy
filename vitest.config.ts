import path from 'node:path'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig(
  () => {
    return {
      plugins: [
        Vue(),
        VueJsx(),
      ],
      resolve: {
        alias: {
          'element-ui': path.resolve(import.meta.dirname),
          'packages': path.resolve(import.meta.dirname, 'packages'),
          'main': path.resolve(import.meta.dirname, 'src'),
        },
      },
      test: {
        // resolve: {
        //   alias: {
        //     'element-ui': path.resolve(import.meta.dirname),
        //   },
        // },
        projects: [
          '.',
          'packages/*',
          'apps/*',
        ],
        coverage: {
          enabled: true,
          all: false,
          skipFull: true,
        },
        forceRerunTriggers: [
          '**/{vitest,vite}.config.*/**',
        ],
        environment: 'jsdom',
        include: [
          'test\/**\/*.{test,spec}.?(c|m)[jt]s?(x)',
        ],
        globals: true,
      },
    }
  },
)
