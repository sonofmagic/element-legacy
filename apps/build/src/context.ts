import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface WorkspaceContext {
  require: NodeRequire
  dir: string
  rootDir: string
  resolveFromRoot: (...segments: string[]) => string
  resolveFromApps: (...segments: string[]) => string
  resolveFromUi: (...segments: string[]) => string
  resolveFromDocs: (...segments: string[]) => string
  resolveFromPackages: (...segments: string[]) => string
  resolveFromSrc: (...segments: string[]) => string
  resolveFromLib: (...segments: string[]) => string
}

export type PathResolver = WorkspaceContext['resolveFromRoot']

export function createWorkspaceContext(metaUrl: string): WorkspaceContext {
  const dir = dirname(fileURLToPath(metaUrl))
  const rootDir = resolve(dir, '../../..')
  const resolver = (...segments: string[]) => resolve(rootDir, ...segments)
  const resolveFromUi = (...segments: string[]) => resolver('apps', 'ui', ...segments)

  return {
    require: createRequire(metaUrl),
    dir,
    rootDir,
    resolveFromRoot: resolver,
    resolveFromApps: (...segments: string[]) => resolver('apps', ...segments),
    resolveFromUi,
    resolveFromDocs: (...segments: string[]) => resolver('apps', 'docs', ...segments),
    resolveFromPackages: (...segments: string[]) => resolveFromUi('packages', ...segments),
    resolveFromSrc: (...segments: string[]) => resolveFromUi('src', ...segments),
    resolveFromLib: (...segments: string[]) => resolveFromUi('lib', ...segments),
  }
}
