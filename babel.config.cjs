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
  ],
}
