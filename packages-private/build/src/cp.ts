import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'

function usage(): never {
  console.error('Usage: element-legacy-build cp <source> <destination>')
  process.exit(1)
}

function resolvePath(path: string): string {
  return isAbsolute(path) ? path : resolve(process.cwd(), path)
}

async function copyEntry(src: string, dest: string): Promise<void> {
  const srcStat = await stat(src).catch(() => null)
  if (!srcStat) {
    throw new Error(`Source path does not exist: ${src}`)
  }

  if (srcStat.isDirectory()) {
    await rm(dest, { recursive: true, force: true })
    await mkdir(dest, { recursive: true })

    const entries = await readdir(src)
    await Promise.all(entries.map(entry => copyEntry(join(src, entry), join(dest, entry))))
    return
  }

  if (srcStat.isFile()) {
    await mkdir(dirname(dest), { recursive: true })
    await copyFile(src, dest)
    return
  }

  throw new Error(`Unsupported source entry type at ${src}`)
}

async function main(): Promise<void> {
  const [, , srcArg, destArg, ...restArgs] = process.argv
  if (!srcArg || !destArg || restArgs.length > 0) {
    usage()
  }

  const src = resolvePath(srcArg)
  const dest = resolvePath(destArg)

  if (src === dest) {
    throw new Error('Source and destination paths must be different')
  }

  await copyEntry(src, dest)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
