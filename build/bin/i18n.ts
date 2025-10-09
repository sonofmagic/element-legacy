import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

interface LangConfigEntry {
  lang: string
  pages: Record<string, Record<string, string>>
}

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const langConfig = require('../../examples/i18n/page.json') as LangConfigEntry[]

langConfig.forEach((lang) => {
  const pageDir = resolve(__dirname, `../../examples/pages/${lang.lang}`)

  try {
    statSync(pageDir)
  }
  catch {
    mkdirSync(pageDir, { recursive: true })
  }

  Object.keys(lang.pages).forEach((page) => {
    const templatePath = resolve(__dirname, `../../examples/pages/template/${page}.tpl`)
    const outputPath = resolve(__dirname, `../../examples/pages/${lang.lang}/${page}.vue`)
    let content = readFileSync(templatePath, 'utf8')
    const pairs = lang.pages[page]

    Object.keys(pairs).forEach((key) => {
      content = content.replace(new RegExp(`<%=\\s*${key}\\s*>`, 'g'), pairs[key])
    })

    writeFileSync(outputPath, content)
  })
})
