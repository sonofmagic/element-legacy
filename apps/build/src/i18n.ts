import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createWorkspaceContext } from './context'

interface LangConfigEntry {
  lang: string
  pages: Record<string, Record<string, string>>
}

const { require: workspaceRequire, resolveFromDocs } = createWorkspaceContext(import.meta.url)

const langConfig = workspaceRequire(resolveFromDocs('i18n', 'page.json')) as LangConfigEntry[]

langConfig.forEach((lang) => {
  const pageDir = resolveFromDocs('pages', lang.lang)

  try {
    statSync(pageDir)
  }
  catch {
    mkdirSync(pageDir, { recursive: true })
  }

  Object.keys(lang.pages).forEach((page) => {
    const templatePath = resolveFromDocs('pages', 'template', `${page}.tpl`)
    const outputPath = resolveFromDocs('pages', lang.lang, `${page}.vue`)
    let content = readFileSync(templatePath, 'utf8')
    const pairs = lang.pages[page]

    Object.keys(pairs).forEach((key) => {
      content = content.replace(new RegExp(`<%=\\s*${key}\\s*>`, 'g'), pairs[key])
    })

    writeFileSync(outputPath, content)
  })
})
