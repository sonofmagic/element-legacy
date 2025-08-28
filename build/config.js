let fs = require('node:fs')
let path = require('node:path')
let nodeExternals = require('webpack-node-externals')
let Components = require('../components.json')

let utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'))
let mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'))
let transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'))
let externals = {}

Object.keys(Components).forEach((key) => {
  externals[`element-ui/packages/${key}`] = `element-ui/lib/${key}`
})

externals['element-ui/src/locale'] = 'element-ui/lib/locale'
utilsList.forEach((file) => {
  file = path.basename(file, '.js')
  externals[`element-ui/src/utils/${file}`] = `element-ui/lib/utils/${file}`
})
mixinsList.forEach((file) => {
  file = path.basename(file, '.js')
  externals[`element-ui/src/mixins/${file}`] = `element-ui/lib/mixins/${file}`
})
transitionList.forEach((file) => {
  file = path.basename(file, '.js')
  externals[`element-ui/src/transitions/${file}`] = `element-ui/lib/transitions/${file}`
})

externals = [Object.assign({
  vue: 'vue',
}, externals), nodeExternals()]

exports.externals = externals

exports.alias = {
  'main': path.resolve(__dirname, '../src'),
  'packages': path.resolve(__dirname, '../packages'),
  'examples': path.resolve(__dirname, '../examples'),
  'element-ui': path.resolve(__dirname, '../'),
}

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue',
}

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js|utils\/lodash\.js/
