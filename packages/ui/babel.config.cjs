const path = require('node:path')

const toPosix = value => value.replace(/\\/g, '/')

function relativeElementImportPlugin({ mappings }) {
  return {
    name: 'relative-element-ui-imports',
    visitor: {
      ImportDeclaration(babelPath, state) {
        rewriteSource(babelPath.node.source, state, mappings)
      },
      ExportNamedDeclaration(babelPath, state) {
        if (babelPath.node.source) {
          rewriteSource(babelPath.node.source, state, mappings)
        }
      },
      ExportAllDeclaration(babelPath, state) {
        rewriteSource(babelPath.node.source, state, mappings)
      },
    },
  }
}

function rewriteSource(sourceNode, state, mappings) {
  if (!sourceNode || !sourceNode.value) {
    return
  }
  const sourceValue = sourceNode.value
  const match = Object.keys(mappings).find(prefix => sourceValue === prefix || sourceValue.startsWith(`${prefix}/`))
  if (!match) {
    return
  }

  const remainder = sourceValue.slice(match.length).replace(/^\//, '')
  const targetBase = mappings[match]
  const targetPath = path.resolve(targetBase, remainder)
  const filename = state.file?.opts?.filename
  if (!filename) {
    return
  }

  const fromDir = path.dirname(filename)
  let relativePath = path.relative(fromDir, targetPath)
  relativePath = toPosix(relativePath)
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`
  }
  sourceNode.value = relativePath
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: '3.22',
        modules: false, // 保留 ES modules
        targets: { esmodules: true }, // 只转译 ES Modules 支持的环境
      },
    ],
    '@babel/preset-typescript',
  ],
  env: {
    utils: {
      plugins: [
        relativeElementImportPlugin({
          mappings: {
            'element-ui/src': path.resolve(__dirname, 'src'),
            'element-ui/packages': path.resolve(__dirname, 'packages'),
          },
        }),
      ],
    },
  },
}
