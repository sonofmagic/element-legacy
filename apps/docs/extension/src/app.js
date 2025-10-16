import Element from 'main/index.js'
import Vue from 'vue'
import App from './editor/index.vue'
import '../../../../packages/theme-chalk/src/index.scss'

export default () => {
  Vue.use(Element, { zIndex: 100000 })
  const root = document.createElement('div')
  document.body.appendChild(root)

  window.ga = (..._args) => {}

  new Vue({
    render: h => h(App),
  }).$mount(root)
}
