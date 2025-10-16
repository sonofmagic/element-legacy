import { readdir, readFile } from 'node:fs/promises'
import { algoliasearch } from 'algoliasearch'
import { slugify } from 'transliteration'
import { createWorkspaceContext } from './context'

type LanguageKey = 'zh-CN' | 'en-US' | 'es' | 'fr-FR'

interface DocIndexRecord {
  objectID: string
  component: string
  title: string
  ranking: number
  anchor: string
  content: string
}

const { require: workspaceRequire, resolveFromExamples } = createWorkspaceContext(import.meta.url)

const key = workspaceRequire('./algolia-key') as string

const client = algoliasearch('4C63BTGP6S', key)

const langs: Record<LanguageKey, string> = {
  'zh-CN': 'element-zh',
  'en-US': 'element-en',
  'es': 'element-es',
  'fr-FR': 'element-fr',
}

const supportedLangs: LanguageKey[] = ['zh-CN', 'en-US', 'es', 'fr-FR']

function removeCodeAndCustomBlocks(content: string) {
  return content
    .replace(/:::[\s\S]*?:::/g, '')
    .replace(/```[\s\S]*?```/g, '')
}

async function collectRecordsFor(lang: LanguageKey): Promise<DocIndexRecord[]> {
  const docsDirectory = resolveFromExamples('docs', lang)
  const files = await readdir(docsDirectory)
  const indices: DocIndexRecord[] = []

  for (const file of files) {
    if (!file.endsWith('.md')) {
      continue
    }

    const component = file.replace('.md', '')
    const content = await readFile(resolveFromExamples('docs', lang, file), 'utf8')
    const rawHeadings = removeCodeAndCustomBlocks(content).match(/#{2,4}[^#]*/g) ?? []
    const normalizedHeadings = rawHeadings
      .map(heading => heading.replace(/\n+/g, '\n').split('\n').filter(Boolean))
      .map((parts) => {
        if (parts.length > 2) {
          const [title, ...rest] = parts
          return [title, rest.join('')] as [string, string]
        }
        return parts as [string, string?]
      })

    normalizedHeadings.forEach((parts, idx) => {
      const [rawTitle, rawDescription] = parts
      const title = rawTitle.replace(/#{2,4}/, '').trim()
      const isComponent = !rawTitle.includes('###')
      const anchor = slugify(title)

      indices.push({
        objectID: `${lang}-${component}-${anchor}-${idx}`,
        component,
        title,
        ranking: isComponent ? 2 : 1,
        anchor,
        content: (rawDescription || title).replace(/<[^>]+>/g, ''),
      })
    })
  }

  return indices
}

async function syncIndex(lang: LanguageKey) {
  const indexName = langs[lang]
  const records = await collectRecordsFor(lang)

  try {
    await client.clearObjects({ indexName })
  }
  catch (error) {
    console.warn(`[algolia] Failed to clear index ${indexName}`, error)
  }

  if (!records.length) {
    console.warn(`[algolia] No records found for ${indexName}`)
    return
  }

  await client.saveObjects({
    indexName,
    objects: records,
    waitForTasks: true,
  })

  console.log(`[algolia] Indexed ${records.length} records for ${indexName}`)
}

async function run() {
  for (const lang of supportedLangs) {
    await syncIndex(lang)
  }
}

run().catch((error) => {
  console.error('[algolia] Failed to generate indices', error)
  process.exit(1)
})
