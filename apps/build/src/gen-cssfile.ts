import { statSync, writeFileSync } from 'node:fs'
import { createWorkspaceContext } from './context'

const { require: workspaceRequire, resolveFromApps, resolveFromUi } = createWorkspaceContext(import.meta.url)

const components = Object.keys(workspaceRequire(resolveFromUi('components.json')) as Record<string, string>)

const themes = [
  'theme-chalk',
]

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
  const resolveTheme = (...segments: string[]) => resolveFromApps(theme, ...segments)

  components.forEach((key) => {
    if (['icon', 'option', 'option-group'].includes(key)) {
      return
    }

    const fileName = `${key}${isSCSS ? '.scss' : '.css'}`
    indexContent += `@use './${key}';\n`
    const filePath = resolveTheme('src', fileName)

    if (!fileExists(filePath)) {
      writeFileSync(filePath, '', 'utf8')
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件')
    }
  })

  writeFileSync(resolveTheme('src', isSCSS ? 'index.scss' : 'index.css'), indexContent)
})
