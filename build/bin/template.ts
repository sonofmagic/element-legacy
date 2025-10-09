import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import chokidar from 'chokidar'

const templates = resolve(process.cwd(), './examples/pages/template')

const watcher = chokidar.watch([templates])

watcher.on('ready', () => {
  watcher.on('change', () => {
    exec('npm run i18n')
  })
})

const exec = (cmd: string) => {
  execSync(cmd, { stdio: 'inherit' })
}
