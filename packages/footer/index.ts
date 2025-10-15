import type { VueConstructor } from 'vue'
import Footer from './src/main.vue'

type InstallableFooter = typeof Footer & {
  install: (vue: VueConstructor) => void
}

const _Footer = Footer as InstallableFooter

/* istanbul ignore next */
_Footer.install = function install(Vue: VueConstructor) {
  Vue.component(_Footer.name, _Footer)
}

export default _Footer
