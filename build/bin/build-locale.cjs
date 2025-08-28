let fs = require('node:fs')
let save = require('file-save')
let resolve = require('node:path').resolve
let basename = require('node:path').basename

let localePath = resolve(__dirname, '../../src/locale/lang')
let fileList = fs.readdirSync(localePath)

let transform = function (filename, name, cb) {
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', { loose: true }],
    ],
    moduleId: name,
  }, cb)
}

fileList
  .filter((file) => {
    return /\.js$/.test(file)
  })
  .forEach((file) => {
    let name = basename(file, '.js')

    transform(file, name, (err, result) => {
      if (err) {
        console.error(err)
      }
      else {
        let code = result.code

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.')
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code)

        console.log(file)
      }
    })
  })
