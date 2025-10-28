#!/usr/bin/env node
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const COMMAND_MAP = new Map([
  ['cp', 'cp'],
  ['build-entry', 'build-entry'],
  ['build-locale', 'build-locale'],
  ['gen-cssfile', 'gen-cssfile'],
  ['gen-indices', 'gen-indices'],
  ['i18n', 'i18n'],
  ['icon-init', 'iconInit'],
  ['new', 'new'],
  ['new-lang', 'new-lang'],
  ['version', 'version'],
])

const flags = new Set(['-h', '--help', 'help'])

function printHelp(exitCode = 0) {
  console.log('Usage: element-legacy-build <command> [...args]')
  console.log()
  console.log('Commands:')
  for (const [alias] of COMMAND_MAP) {
    console.log(`  ${alias}`)
  }
  process.exit(exitCode)
}

async function main() {
  const [, , ...argv] = process.argv
  if (argv.length === 0 || flags.has(argv[0])) {
    printHelp(argv.length === 0 ? 1 : 0)
    return
  }

  const [command, ...commandArgs] = argv
  const target = COMMAND_MAP.get(command)

  if (!target) {
    console.error(`Unknown command: ${command}`)
    printHelp(1)
    return
  }

  try {
    await import('tsx/esm')
  }
  catch (error) {
    console.error('Failed to load tsx runtime required for TypeScript execution.')
    console.error(String(error))
    process.exit(1)
  }

  const moduleUrl = new URL(`../src/${target}.ts`, import.meta.url)

  process.argv = [
    process.argv[0],
    fileURLToPath(moduleUrl),
    ...commandArgs,
  ]

  await import(moduleUrl.href)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
