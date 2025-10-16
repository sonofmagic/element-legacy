import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { createWorkspaceContext } from './context'

const { require: workspaceRequire, resolveFromDocs, resolveFromRoot } = createWorkspaceContext(import.meta.url)

const pkg = workspaceRequire(resolveFromRoot('package.json')) as { version?: string }

const version = process.env.VERSION || pkg.version || ''

const content: Record<string, string> = {

}

if (!content[version]) {
  content[version] = '2.15'
}

writeFileSync(resolveFromDocs('versions.json'), JSON.stringify(content))
