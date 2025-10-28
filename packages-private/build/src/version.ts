import process from 'node:process'
import { createWorkspaceContext } from './context'

const { require: workspaceRequire, resolveFromUi } = createWorkspaceContext(import.meta.url)

const pkg = workspaceRequire(resolveFromUi('package.json')) as { version?: string }

const version = process.env.VERSION || pkg.version || ''

console.log('[element-legacy-build version] versions.json generation has been deprecated.')
if (version) {
  console.log(`[element-legacy-build version] Current package version detected: ${version}`)
}
