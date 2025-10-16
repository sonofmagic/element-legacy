import { execSync } from 'node:child_process'
import chokidar from 'chokidar'
import { createWorkspaceContext } from './context'

const { resolveFromExamples } = createWorkspaceContext(import.meta.url)
const templates = resolveFromExamples('pages', 'template')

const watcher = chokidar.watch([templates])

watcher.on('ready', () => {
  watcher.on('change', () => {
    exec('npm run i18n')
  })
})

function exec(cmd: string) {
  execSync(cmd, { stdio: 'inherit' })
}
