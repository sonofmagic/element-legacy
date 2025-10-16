import type { CreateElement, VNode } from 'vue'
import Element from 'main/index.js'
import Vue from 'vue'
import App from './play/index.vue'
import '../../packages/theme-chalk/src/index.scss'

Vue.use(Element)

new Vue({
  render: (h: CreateElement): VNode => h(App),
}).$mount('#app')
