import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const libDir = path.resolve(currentDir, '../lib')
const snapshotsDir = path.join('__snapshots__')

const cssFiles = readdirSync(libDir)
  .filter(name => name.endsWith('.css'))
  .sort()

describe('@element-legacy/theme-chalk CSS snapshots', () => {
  cssFiles.forEach((fileName) => {
    it(`${fileName} formatted output`, async () => {
      const rawCss = readFileSync(path.join(libDir, fileName), 'utf8')
      const formattedCss = await prettier.format(rawCss, { parser: 'css', endOfLine: 'lf' })

      await expect(formattedCss).toMatchFileSnapshot(path.join(snapshotsDir, `${fileName}.snap`))
    })
  })
})
