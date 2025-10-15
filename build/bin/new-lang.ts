import { mkdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

type LocaleEntry = { lang: string } & Record<string, unknown>

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

console.log()
process.on('exit', () => {
  console.log()
})

const lang = process.argv[2]

if (!lang) {
  console.error('[language] is required!')
  process.exit(1)
}

const fileSave = require('file-save') as any

const componentFile = require('../../examples/i18n/component.json') as LocaleEntry[]

if (componentFile.some(item => item.lang === lang)) {
  console.error(`${lang} already exists.`)
  process.exit(1)
}
const baseComponent = componentFile.find(item => item.lang === 'en-US') ?? componentFile[0]
const componentNew: LocaleEntry = { ...baseComponent, lang }
componentFile.push(componentNew)
fileSave(join(__dirname, '../../examples/i18n/component.json'))
  .write(JSON.stringify(componentFile, null, '  '), 'utf8')
  .end('\n')

const pageFile = require('../../examples/i18n/page.json') as LocaleEntry[]

const basePage = pageFile.find(item => item.lang === 'en-US') ?? pageFile[0]
const pageNew: LocaleEntry = { ...basePage, lang }
pageFile.push(pageNew)
fileSave(join(__dirname, '../../examples/i18n/page.json'))
  .write(JSON.stringify(pageFile, null, '  '), 'utf8')
  .end('\n')

const routeFile = require('../../examples/i18n/route.json') as { lang: string }[]

routeFile.push({ lang })
fileSave(join(__dirname, '../../examples/i18n/route.json'))
  .write(JSON.stringify(routeFile, null, '  '), 'utf8')
  .end('\n')

const navFile = require('../../examples/nav.config.json') as Record<string, unknown>

navFile[lang] = navFile['en-US']
fileSave(join(__dirname, '../../examples/nav.config.json'))
  .write(JSON.stringify(navFile, null, '  '), 'utf8')
  .end('\n')

try {
  statSync(resolve(__dirname, `../../examples/docs/${lang}`))
}
catch {
  mkdirSync(resolve(__dirname, `../../examples/docs/${lang}`))
}

console.log('DONE!')
