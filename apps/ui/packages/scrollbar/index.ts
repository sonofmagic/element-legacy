import type { VueConstructor } from 'vue'
import Scrollbar from './src/main'

type InstallableScrollbar = typeof Scrollbar & {
  install: (vue: VueConstructor) => void
}

const _Scrollbar = Scrollbar as InstallableScrollbar

/* istanbul ignore next */
_Scrollbar.install = function install(Vue: VueConstructor) {
  Vue.component(_Scrollbar.name, _Scrollbar)
}

export default _Scrollbar
