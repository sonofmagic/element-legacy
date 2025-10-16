import { readFileSync, writeFile } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

const __dirname = dirname(fileURLToPath(import.meta.url))

const fontFile = readFileSync(resolve(__dirname, '../../apps/theme-chalk/src/icon.scss'), 'utf8')
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

writeFile(resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {})
