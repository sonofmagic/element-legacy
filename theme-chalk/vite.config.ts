import type {
  NormalizedOutputOptions,
  OutputAsset,
  OutputBundle,
  OutputChunk,
  PluginContext,
} from 'rollup'
import type { PluginOption } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

const filePath = fileURLToPath(import.meta.url)
const rootDir = path.dirname(filePath)
const srcDir = path.resolve(rootDir, 'src')
const outDir = path.resolve(rootDir, 'lib')

const fontExtensions = new Set(['.woff', '.woff2', '.ttf', '.eot', '.svg'])

function getScssEntries(): Record<string, string> {
  return Object.fromEntries(
    fs.readdirSync(srcDir)
      .filter(file => file.endsWith('.scss'))
      .map(file => [file.replace(/\.scss$/, ''), path.resolve(srcDir, file)]),
  )
}

function isOutputChunk(item: OutputAsset | OutputChunk): item is OutputChunk {
  return item.type === 'chunk'
}

function isCssAsset(item: OutputAsset | OutputChunk): item is OutputAsset {
  return item.type === 'asset' && item.fileName.endsWith('.css')
}

function removeEmptyJsChunks(): PluginOption {
  return {
    name: 'remove-empty-js-chunks',
    generateBundle(
      this: PluginContext,
      _options: NormalizedOutputOptions,
      bundle: OutputBundle,
    ) {
      for (const [key, value] of Object.entries(bundle)) {
        if (isOutputChunk(value) && value.isEntry && value.code.trim().length === 0) {
          delete bundle[key]
        }
      }
    },
  }
}

function ensureCssAssets(expectedNames: string[]): PluginOption {
  return {
    name: 'ensure-css-assets',
    generateBundle(
      this: PluginContext,
      _options: NormalizedOutputOptions,
      bundle: OutputBundle,
    ) {
      const produced = new Set(
        Object.values(bundle).filter(isCssAsset).map(item => path.basename(item.fileName, '.css')),
      )

      for (const name of expectedNames) {
        if (!produced.has(name)) {
          this.emitFile({
            type: 'asset',
            fileName: `${name}.css`,
            source: '',
          })
        }
      }
    },
  }
}

const cssEntries = getScssEntries()
const cssEntryNames = Object.keys(cssEntries)

export default defineConfig({
  root: rootDir,
  build: {
    outDir,
    emptyOutDir: true,
    assetsDir: '.',
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    rollupOptions: {
      input: cssEntries,
      output: {
        assetFileNames: (assetInfo) => {
          const ext = path.extname(assetInfo.name ?? '')
          if (fontExtensions.has(ext)) {
            return 'fonts/[name][extname]'
          }
          return '[name][extname]'
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
    preprocessorOptions: {
      scss: {
        // includePaths: [srcDir],
        quietDeps: true,
      },
    },
  },
  plugins: [
    removeEmptyJsChunks(),
    ensureCssAssets(cssEntryNames),
  ],
})
