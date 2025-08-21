import fs from 'fs-extra'
import path from 'pathe'


async function main() {
    const from = path.resolve(import.meta.dirname, './lib-before/theme-chalk')
    const to = path.resolve(import.meta.dirname, './lib/theme-chalk')

    await fs.copy(from, to, { overwrite: true })
}

main()