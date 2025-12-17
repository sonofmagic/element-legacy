import type MarkdownIt from 'markdown-it'
import type { MarkdownItAsync } from 'markdown-it-async'
import { Buffer } from 'node:buffer'
import markdownItContainer from 'markdown-it-container'

type MarkdownContainerType = 'tip' | 'warning'

interface MarkdownContainer {
  validate: (params: string) => boolean
  render: (tokens: any[], idx: number) => string
}

type MarkdownRenderer = MarkdownIt | MarkdownItAsync

function createDemoContainer(md: MarkdownRenderer): MarkdownContainer {
  return {
    validate(params: string) {
      return params.trim().startsWith('demo')
    },
    render(tokens: any[], idx: number) {
      const info = tokens[idx].info.trim()
      const firstSpaceIndex = info.indexOf(' ')
      const hasDescription = firstSpaceIndex !== -1
      const descriptionText = hasDescription ? info.slice(firstSpaceIndex + 1).trim() : ''

      if (tokens[idx].nesting === 1) {
        let sourceCode = ''
        let fenceIndex = idx + 1

        while (fenceIndex < tokens.length) {
          const token = tokens[fenceIndex]
          if (token.type === 'fence') {
            sourceCode = token.content
            break
          }
          if (token.type === 'container_demo_close') {
            break
          }
          fenceIndex++
        }

        const encodedSource = Buffer.from(sourceCode).toString('base64')
        const renderedDescription = descriptionText ? md.render(descriptionText) : ''
        const encodedDescription = Buffer.from(renderedDescription).toString('base64')

        return `<Demo source="${encodedSource}" description="${encodedDescription}">\n`
      }
      return '</Demo>\n'
    },
  }
}

function createAlertContainer(md: MarkdownRenderer, type: MarkdownContainerType): MarkdownContainer {
  return {
    validate(params: string) {
      return params.trim().startsWith(type)
    },
    render(tokens: any[], idx: number) {
      const info = tokens[idx].info.trim()
      const content = info.slice(type.length).trim()
      const titleAttr = content ? ` title="${md.utils.escapeHtml(content)}"` : ''
      if (tokens[idx].nesting === 1) {
        return `<DocAlert type="${type}"${titleAttr}>\n`
      }
      return '</DocAlert>\n'
    },
  }
}

export function setupMarkdownContainers(md: MarkdownRenderer) {
  md.use(markdownItContainer, 'demo', createDemoContainer(md))
  md.use(markdownItContainer, 'tip', createAlertContainer(md, 'tip'))
  md.use(markdownItContainer, 'warning', createAlertContainer(md, 'warning'))
}
