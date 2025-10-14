import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const pkg = require('../../package.json') as { version?: string }

const version = process.env.VERSION || pkg.version || ''

const content: Record<string, string> = {

}

if (!content[version]) {
  content[version] = '2.15'
}

writeFileSync(resolve(__dirname, '../../examples/versions.json'), JSON.stringify(content))
