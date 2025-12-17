// @ts-nocheck
import { createVue, destroyVM, wait, waitImmediate } from '../util'
import Message from 'packages/message'

describe('ConfigProvider', () => {
  let vm: any

  beforeEach(() => {
    Message.closeAll()
  })

  afterEach(() => {
    Message.closeAll()
    destroyVM(vm)
  })

  it('provides size to descendants', async () => {
    vm = createVue({
      template: `
        <el-config-provider size="mini">
          <el-button ref="button">按钮</el-button>
        </el-config-provider>
      `,
    }, true)

    await waitImmediate()
    const button = vm.$el.querySelector('.el-button')
    expect(button.classList.contains('el-button--mini')).to.be.true
  })

  it('supports nested overrides', async () => {
    vm = createVue({
      template: `
        <el-config-provider size="mini">
          <el-config-provider size="medium">
            <el-button ref="button">按钮</el-button>
          </el-config-provider>
        </el-config-provider>
      `,
    }, true)

    await waitImmediate()
    const button = vm.$el.querySelector('.el-button')
    expect(button.classList.contains('el-button--medium')).to.be.true
  })

  it('auto inserts space for two Chinese characters', async () => {
    vm = createVue({
      template: `<el-config-provider :button="{ autoInsertSpace: true }"><el-button ref="button">中文</el-button></el-config-provider>`,
    }, true)

    await waitImmediate()
    const text = vm.$el.querySelector('.el-button span')!.textContent!.trim()
    expect(text).to.equal('中 文')
  })

  it('limits message instances with max option', async () => {
    vm = createVue({
      template: `<el-config-provider :message="{ max: 1 }"></el-config-provider>`,
    }, true)

    // ensure config is applied before triggering messages
    await waitImmediate()

    Message({ message: 'first', duration: 0 })
    Message({ message: 'second', duration: 0 })
    Message({ message: 'third', duration: 0 })

    await wait(600)
    expect(document.querySelectorAll('.el-message').length).to.equal(1)
  })
})
