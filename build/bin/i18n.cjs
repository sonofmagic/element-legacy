'use strict'

const fs = require('node:fs')
const path = require('node:path')
const langConfig = require('../../examples/i18n/page.json')

langConfig.forEach((lang) => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${lang.lang}`))
  }
  catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${lang.lang}`))
  }

  Object.keys(lang.pages).forEach((page) => {
    const templatePath = path.resolve(__dirname, `../../examples/pages/template/${page}.tpl`)
    const outputPath = path.resolve(__dirname, `../../examples/pages/${lang.lang}/${page}.vue`)
    let content = fs.readFileSync(templatePath, 'utf8')
    const pairs = lang.pages[page]

    Object.keys(pairs).forEach((key) => {
      content = content.replace(new RegExp(`<%=\\s*${key}\\s*>`, 'g'), pairs[key])
    })

    fs.writeFileSync(outputPath, content)
  })
})
