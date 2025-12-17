import type { ConfigEnv, UserConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import { bundledLanguages, bundledThemes, createHighlighter } from 'shiki'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig, loadEnv } from 'vite'
import { setupMarkdownContainers } from './markdown/setup'

function normalizeBasePath(input?: string | null): string {
  if (!input || !input.trim()) {
    return '/'
  }
  let base = input.trim()
  if (!base.startsWith('/')) {
    base = `/${base}`
  }
  if (!base.endsWith('/')) {
    base = `${base}/`
  }
  return base === '//' ? '/' : base
}

const defaultTheme = 'github-light'
const preferredLanguages = [
  'bash',
  'css',
  'html',
  'javascript',
  'json',
  'markdown',
  'scss',
  'shell',
  'typescript',
  'vue',
  'xml',
] as const

const elementLegacyPackagePath = path.resolve(import.meta.dirname, '../../packages/ui/package.json')
const elementLegacyRoot = path.resolve(import.meta.dirname, '../../packages/ui')
const elementLegacyPackage = JSON.parse(fs.readFileSync(elementLegacyPackagePath, 'utf8')) as { version?: string }
const elementLegacyVersion = elementLegacyPackage.version ?? ''

export default defineConfig(
  async ({ mode }: ConfigEnv): Promise<UserConfig> => {
    const env = loadEnv(mode, import.meta.dirname)
    for (const [key, value] of Object.entries(env)) {
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }

    const docsBasePath = normalizeBasePath(env.VITE_DOCS_BASE ?? process.env.VITE_DOCS_BASE)
    const themeRegistration = bundledThemes[defaultTheme]
    if (!themeRegistration) {
      throw new Error(`Shiki theme "${defaultTheme}" is not available in bundled themes.`)
    }
    const themeName = defaultTheme

    const resolvedLanguages = preferredLanguages
      .map(lang => bundledLanguages[lang])
      .filter((lang): lang is typeof bundledLanguages[keyof typeof bundledLanguages] => Boolean(lang))

    const highlighter = await createHighlighter({
      themes: [themeRegistration],
      langs: resolvedLanguages,
    })
    const loadedLanguages = new Set(highlighter.getLoadedLanguages())

    return {
      base: docsBasePath,
      resolve: {
        alias: {
          'element-legacy': path.resolve(import.meta.dirname, '../../packages/ui'),
          'main': path.resolve(import.meta.dirname, '../../packages/ui/src'),
          'throttle-debounce': path.resolve(import.meta.dirname, './utils/throttle-debounce.ts'),
        // 'vue/compiler-sfc': 'vue-template-compiler',
        },
      },
      define: {
        __ELEMENT_LEGACY_VERSION__: JSON.stringify(elementLegacyVersion),
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
            md.options.highlight = (code, lang) => {
              const normalized = (lang && lang.trim().toLowerCase()) || 'text'
              const language = loadedLanguages.has(normalized) ? normalized : 'text'
              try {
                return highlighter.codeToHtml(code, { lang: language, theme: themeName })
              }
              catch {
                return highlighter.codeToHtml(code, { lang: 'text', theme: themeName })
              }
            }
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
      build: {
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes(`${path.sep}vue`)) {
                  return 'vendor-vue'
                }
                if (id.includes('shiki')) {
                  return 'vendor-shiki'
                }
                if (id.includes('algoliasearch')) {
                  return 'vendor-algolia'
                }
                // keep everything else from node_modules in a single vendor chunk
                // so Vue and our library chunk don't form a cyclic dependency
                return 'vendor'
              }
              if (id.startsWith(elementLegacyRoot)) {
                return 'element-legacy'
              }
            },
          },
        },
      },
    }
  },
)
