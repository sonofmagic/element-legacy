import type { VueConstructor } from 'vue'
import Backtop from './src/main.vue'

type InstallableBacktop = typeof Backtop & {
  install: (vue: VueConstructor) => void
}

const _Backtop = Backtop as InstallableBacktop

/* istanbul ignore next */
_Backtop.install = function install(Vue: VueConstructor) {
  Vue.component(_Backtop.name, _Backtop)
}

export default _Backtop
