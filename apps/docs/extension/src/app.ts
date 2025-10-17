import Element from 'main/index'
import Vue from 'vue'
import App from './editor/index.vue'
import '../../../../packages/theme-chalk/src/index.scss'

declare global {
  interface Window {
    ga?: (...args: unknown[]) => void
  }
}

export default function bootstrapApp(): void {
  Vue.use(Element, { zIndex: 100000 })
  const root = document.createElement('div')
  document.body.appendChild(root)

  window.ga = (..._args: unknown[]) => {}

  new Vue({
    render: h => h(App),
  }).$mount(root)
}
