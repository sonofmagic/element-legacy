import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const pkg = require('../../package.json') as { version?: string }
const version = process.env.VERSION || pkg.version || ''

const content: Record<string, string> = {
  '1.4.13': '1.4',
  '2.0.11': '2.0',
  '2.1.0': '2.1',
  '2.2.2': '2.2',
  '2.3.9': '2.3',
  '2.4.11': '2.4',
  '2.5.4': '2.5',
  '2.6.3': '2.6',
  '2.7.2': '2.7',
  '2.8.2': '2.8',
  '2.9.2': '2.9',
  '2.10.1': '2.10',
  '2.11.1': '2.11',
  '2.12.0': '2.12',
  '2.13.2': '2.13',
  '2.14.1': '2.14',
}

if (!content[version]) {
  content[version] = '2.15'
}

writeFileSync(resolve(__dirname, '../../examples/versions.json'), JSON.stringify(content))
