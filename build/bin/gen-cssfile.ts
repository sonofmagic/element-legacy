import { statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const components = Object.keys(require('../../components.json') as Record<string, string>)

const themes = [
  'theme-chalk',
]
const basePath = resolve(__dirname, '../../')

function fileExists(filePath: string) {
  try {
    return statSync(filePath).isFile()
  }
  catch {
    return false
  }
}

themes.forEach((theme) => {
  const isSCSS = theme !== 'theme-default'
  let indexContent = isSCSS ? '@use \'./base\';\n' : '@use \'./base.css\';\n'

  components.forEach((key) => {
    if (['icon', 'option', 'option-group'].includes(key)) {
      return
    }

    const fileName = `${key}${isSCSS ? '.scss' : '.css'}`
    indexContent += `@use './${key}';\n`
    const filePath = resolve(basePath, theme, 'src', fileName)

    if (!fileExists(filePath)) {
      writeFileSync(filePath, '', 'utf8')
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件')
    }
  })

  writeFileSync(resolve(basePath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent)
})
