import fs from 'node:fs'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue2'
import VueJsx from '@vitejs/plugin-vue2-jsx'
import { defineConfig } from 'vite'
import entry from './components.json'

const workspaceRoot = import.meta.dirname
const srcRoot = path.resolve(workspaceRoot, 'src')
const packagesRoot = path.resolve(workspaceRoot, 'packages')
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js'])
const ADDITIONAL_ENTRY_DIRS = ['utils', 'directives', 'locale', 'mixins', 'transitions']

function toPosix(input: string): string {
  return input.split(path.sep).join('/')
}

function stripExtension(input: string): string {
  return input.replace(/\.[^.]+$/, '')
}

function isSourceFile(filePath: string): boolean {
  if (filePath.endsWith('.d.ts')) {
    return false
  }
  return SOURCE_EXTENSIONS.has(path.extname(filePath))
}

function collectAdditionalEntries(): Record<string, string> {
  const entries: Record<string, string> = {}

  const walk = (directory: string) => {
    const items = fs.readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))

    for (const item of items) {
      const absolutePath = path.resolve(directory, item.name)
      if (item.isDirectory()) {
        walk(absolutePath)
      }
      else if (item.isFile() && isSourceFile(absolutePath)) {
        const relativePath = path.relative(srcRoot, absolutePath)
        const normalizedName = toPosix(stripExtension(relativePath))
        entries[normalizedName] = absolutePath
      }
    }
  }

  for (const dir of ADDITIONAL_ENTRY_DIRS) {
    const targetDir = path.resolve(srcRoot, dir)
    if (fs.existsSync(targetDir)) {
      walk(targetDir)
    }
  }

  return entries
}

const packageJson = JSON.parse(fs.readFileSync(path.resolve(workspaceRoot, 'package.json'), 'utf8')) as { version?: string }
const additionalEntries = collectAdditionalEntries()
const libEntry = {
  ...entry,
  index: path.resolve(srcRoot, 'index.ts'),
  ...additionalEntries,
}

export default defineConfig({
  resolve: {
    alias: {
      'element-ui': workspaceRoot,
      'element-ui/src': srcRoot,
      'element-ui/packages': packagesRoot,
      'vue': 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
  ],
  define: {
    __ELEMENT_LEGACY_VERSION__: JSON.stringify(packageJson.version ?? ''),
  },
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: libEntry,
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: chunk => `${toPosix(chunk.name)}.js`,
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
