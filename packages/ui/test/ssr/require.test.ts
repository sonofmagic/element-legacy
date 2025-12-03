const path = require('node:path')

describe('Name of the group', () => {
  it('SSR require test', () => {
    try {
      process.env.VUE_ENV = 'server'
      const libPath = path.resolve(__dirname, '../../lib/index')
      require(libPath)
      console.log('SSR require test PASS')
    }
    catch (e) {
      console.error('SSR require test error')
      throw new Error(e)
    }
  })
})
