import type { VueConstructor } from 'vue'
import Divider from './src/main.vue'

type InstallableDivider = typeof Divider & {
  install: (vue: VueConstructor) => void
}

const _Divider = Divider as InstallableDivider

/* istanbul ignore next */
_Divider.install = function install(Vue: VueConstructor) {
  Vue.component(_Divider.name, _Divider)
}

export default _Divider
