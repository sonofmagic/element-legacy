import { readFileSync, writeFile } from 'node:fs'
import postcss from 'postcss'
import { createWorkspaceContext } from './context'

const { resolveFromApps, resolveFromDocs } = createWorkspaceContext(import.meta.url)

const fontFile = readFileSync(resolveFromApps('theme-chalk', 'src', 'icon.scss'), 'utf8')
const nodes = postcss.parse(fontFile).nodes ?? []
const classList: string[] = []

nodes.forEach((node) => {
  const selector = 'selector' in node ? (node as { selector?: string }).selector ?? '' : ''
  const match = selector.match(/\.el-icon-([^:]+):before/)

  if (match && match[1]) {
    classList.push(match[1])
  }
})

classList.reverse()

writeFile(resolveFromDocs('icon.json'), JSON.stringify(classList), () => {})
