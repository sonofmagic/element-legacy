import type { VueConstructor } from 'vue'
import Aside from './src/main.vue'

type InstallableAside = typeof Aside & {
  install: (vue: VueConstructor) => void
}

const _Aside = Aside as InstallableAside

/* istanbul ignore next */
_Aside.install = function install(Vue: VueConstructor) {
  Vue.component(_Aside.name, _Aside)
}

export default _Aside
