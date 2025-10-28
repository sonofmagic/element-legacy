import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'
import { build as viteBuild } from 'vite'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const libDir = path.resolve(currentDir, '../lib')
const snapshotsDir = path.join('__snapshots__')

if (!existsSync(libDir)) {
  await viteBuild({
    configFile: path.resolve(currentDir, '../vite.config.ts'),
    logLevel: 'silent',
  })
}

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
