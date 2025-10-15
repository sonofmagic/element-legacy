import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

const filePath = fileURLToPath(import.meta.url)
const rootDir = path.dirname(filePath)
const srcDir = path.resolve(rootDir, 'src')
const outDir = path.resolve(rootDir, 'lib')

function getScssEntries() {
  return Object.fromEntries(
    fs.readdirSync(srcDir)
      .filter(file => file.endsWith('.scss'))
      .map(file => [file.replace(/\.scss$/, ''), path.resolve(srcDir, file)]),
  )
}

function removeEmptyJsChunks() {
  return {
    name: 'remove-empty-js-chunks',
    generateBundle(_, bundle) {
      for (const [key, value] of Object.entries(bundle)) {
        if (
          value.type === 'chunk'
          && value.isEntry
          && (!value.code || value.code.trim().length === 0)
        ) {
          delete bundle[key]
        }
      }
    },
  }
}

function ensureCssAssets(expectedNames) {
  return {
    name: 'ensure-css-assets',
    generateBundle(_, bundle) {
      const produced = new Set(
        Object.values(bundle)
          .filter(item => item.type === 'asset' && item.fileName.endsWith('.css'))
          .map(item => path.basename(item.fileName, '.css')),
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
    rollupOptions: {
      input: cssEntries,
      output: {
        assetFileNames: assetInfo => {
          const ext = path.extname(assetInfo.name ?? '')
          if (['.woff', '.woff2', '.ttf', '.eot', '.svg'].includes(ext)) {
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
        includePaths: [srcDir],
        quietDeps: true,
      },
    },
  },
  plugins: [
    removeEmptyJsChunks(),
    ensureCssAssets(cssEntryNames),
  ],
})
