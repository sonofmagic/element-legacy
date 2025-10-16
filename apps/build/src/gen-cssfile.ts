import { statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createWorkspaceContext } from './context'

const { require: workspaceRequire, resolveFromRoot } = createWorkspaceContext(import.meta.url)

const components = Object.keys(workspaceRequire(resolveFromRoot('components.json')) as Record<string, string>)

const themes = [
  'theme-chalk',
]
const basePath = resolveFromRoot('apps')

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
