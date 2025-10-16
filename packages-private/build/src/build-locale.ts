import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { createWorkspaceContext } from './context'

interface TransformResult { code: string }

const { require: workspaceRequire, resolveFromSrc, resolveFromLib } = createWorkspaceContext(import.meta.url)
const save = workspaceRequire('file-save') as any
const babel = workspaceRequire('@babel/core') as typeof import('@babel/core')

const localePath = resolveFromSrc('locale/lang')
const fileList = readdirSync(localePath)

function transform(filename: string, name: string, cb: (err: Error | null, result?: TransformResult) => void) {
  babel.transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', { loose: true }],
    ],
    moduleId: name,
  }, cb)
}

fileList
  .filter(file => /\.js$/.test(file))
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

      save(resolveFromLib('umd/locale', file)).write(code)

      console.log(file)
    })
  })
