'use strict'

let fs = require('node:fs')
let path = require('node:path')
let postcss = require('postcss')

let fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8')
let nodes = postcss.parse(fontFile).nodes
let classList = []

nodes.forEach((node) => {
  let selector = node.selector || ''
  let reg = new RegExp(/\.el-icon-([^:]+):before/)
  let arr = selector.match(reg)

  if (arr && arr[1]) {
    classList.push(arr[1])
  }
})

classList.reverse() // 希望按 css 文件顺序倒序排列

fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {})
