const path = require('node:path')

describe.skip('Name of the group', () => {
  it('SSR require test', () => {
    try {
      process.env.VUE_ENV = 'server'
      require(path.join(process.env.PWD, './lib/index'))
      console.log('SSR require test PASS')
    }
    catch (e) {
      console.error('SSR require test error')
      throw new Error(e)
    }
  })
})
