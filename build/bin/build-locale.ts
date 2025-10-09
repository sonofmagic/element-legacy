import { readdirSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

type TransformResult = { code: string }

const require = createRequire(import.meta.url)
const save = require('file-save') as any
const babelCore = require('babel-core') as any

const __dirname = dirname(fileURLToPath(import.meta.url))

const localePath = resolve(__dirname, '../../src/locale/lang')
const fileList = readdirSync(localePath)

const transform = (filename: string, name: string, cb: (err: Error | null, result?: TransformResult) => void) => {
  babelCore.transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', { loose: true }],
    ],
    moduleId: name,
  }, cb)
}

fileList
  .filter((file) => /\.js$/.test(file))
  .forEach((file) => {
    const name = basename(file, '.js')

    transform(file, name, (err, result) => {
      if (err) {
        console.error(err)
        return
      }

      const code = (result?.code || '')
        .replace('define(\'', 'define(\'element/locale/')
        .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.')

      save(resolve(__dirname, '../../lib/umd/locale', file)).write(code)

      console.log(file)
    })
  })
