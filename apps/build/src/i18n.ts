import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createWorkspaceContext } from './context'

interface LangConfigEntry {
  lang: string
  pages: Record<string, Record<string, string>>
}

const { require: workspaceRequire, resolveFromExamples } = createWorkspaceContext(import.meta.url)

const langConfig = workspaceRequire(resolveFromExamples('i18n', 'page.json')) as LangConfigEntry[]

langConfig.forEach((lang) => {
  const pageDir = resolveFromExamples('pages', lang.lang)

  try {
    statSync(pageDir)
  }
  catch {
    mkdirSync(pageDir, { recursive: true })
  }

  Object.keys(lang.pages).forEach((page) => {
    const templatePath = resolveFromExamples('pages', 'template', `${page}.tpl`)
    const outputPath = resolveFromExamples('pages', lang.lang, `${page}.vue`)
    let content = readFileSync(templatePath, 'utf8')
    const pairs = lang.pages[page]

    Object.keys(pairs).forEach((key) => {
      content = content.replace(new RegExp(`<%=\\s*${key}\\s*>`, 'g'), pairs[key])
    })

    writeFileSync(outputPath, content)
  })
})
