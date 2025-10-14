import { readdir, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import algoliasearch from 'algoliasearch'
import { slugify } from 'transliteration'

type LanguageKey = 'zh-CN' | 'en-US' | 'es' | 'fr-FR'

interface DocIndexRecord {
  component: string
  title: string
  ranking: number
  anchor: string
  content: string
}

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const key = require('./algolia-key') as string

const client = algoliasearch('4C63BTGP6S', key)

const langs: Record<LanguageKey, string> = {
  'zh-CN': 'element-zh',
  'en-US': 'element-en',
  'es': 'element-es',
  'fr-FR': 'element-fr',
}

const supportedLangs: LanguageKey[] = ['zh-CN', 'en-US', 'es', 'fr-FR']

supportedLangs.forEach((lang) => {
  const indexName = langs[lang]
  const index: any = client.initIndex(indexName)

  index.clearIndex((clearErr: unknown) => {
    if (clearErr) {
      return
    }

    readdir(resolve(__dirname, `../../examples/docs/${lang}`), (readErr, files) => {
      if (readErr || !files) {
        return
      }

      let indices: DocIndexRecord[] = []

      files.forEach((file) => {
        const component = file.replace('.md', '')
        const content = readFileSync(resolve(__dirname, `../../examples/docs/${lang}/${file}`), 'utf8')

        const rawHeadings = content
          .replace(/:::[\s\S]*?:::/g, '')
          .replace(/```[\s\S]*?```/g, '')
          .match(/#{2,4}[^#]*/g) ?? []

        const normalizedHeadings = rawHeadings
          .map(heading => heading.replace(/\n+/g, '\n').split('\n').filter(Boolean))
          .map((parts) => {
            if (parts.length > 2) {
              const [title, ...rest] = parts
              return [title, rest.join('')] as [string, string]
            }
            return parts as [string, string?]
          })

        const componentIndices = normalizedHeadings.map<DocIndexRecord>((parts) => {
          const [rawTitle, rawDescription] = parts
          const title = rawTitle.replace(/#{2,4}/, '').trim()
          const isComponent = !rawTitle.includes('###')

          return {
            component,
            title,
            ranking: isComponent ? 2 : 1,
            anchor: slugify(title),
            content: (rawDescription || title).replace(/<[^>]+>/g, ''),
          }
        })

        indices = indices.concat(componentIndices)
      })

      index.addObjects(indices, (addErr: unknown, res: unknown) => {
        console.log(addErr, res)
      })
    })
  })
})
