import { mkdirSync, statSync } from 'node:fs'
import process from 'node:process'
import { createWorkspaceContext } from './context'

type LocaleEntry = { lang: string } & Record<string, unknown>

const { require: workspaceRequire, resolveFromExamples } = createWorkspaceContext(import.meta.url)

console.log()
process.on('exit', () => {
  console.log()
})

const lang = process.argv[2]

if (!lang) {
  console.error('[language] is required!')
  process.exit(1)
}

const fileSave = workspaceRequire('file-save') as any

const componentFile = workspaceRequire(resolveFromExamples('i18n', 'component.json')) as LocaleEntry[]

if (componentFile.some(item => item.lang === lang)) {
  console.error(`${lang} already exists.`)
  process.exit(1)
}
const baseComponent = componentFile.find(item => item.lang === 'en-US') ?? componentFile[0]
const componentNew: LocaleEntry = { ...baseComponent, lang }
componentFile.push(componentNew)
fileSave(resolveFromExamples('i18n', 'component.json'))
  .write(JSON.stringify(componentFile, null, '  '), 'utf8')
  .end('\n')

const pageFile = workspaceRequire(resolveFromExamples('i18n', 'page.json')) as LocaleEntry[]

const basePage = pageFile.find(item => item.lang === 'en-US') ?? pageFile[0]
const pageNew: LocaleEntry = { ...basePage, lang }
pageFile.push(pageNew)
fileSave(resolveFromExamples('i18n', 'page.json'))
  .write(JSON.stringify(pageFile, null, '  '), 'utf8')
  .end('\n')

const routeFile = workspaceRequire(resolveFromExamples('i18n', 'route.json')) as { lang: string }[]

routeFile.push({ lang })
fileSave(resolveFromExamples('i18n', 'route.json'))
  .write(JSON.stringify(routeFile, null, '  '), 'utf8')
  .end('\n')

const navFile = workspaceRequire(resolveFromExamples('nav.config.json')) as Record<string, unknown>

navFile[lang] = navFile['en-US']
fileSave(resolveFromExamples('nav.config.json'))
  .write(JSON.stringify(navFile, null, '  '), 'utf8')
  .end('\n')

try {
  statSync(resolveFromExamples('docs', lang))
}
catch {
  mkdirSync(resolveFromExamples('docs', lang))
}

console.log('DONE!')
