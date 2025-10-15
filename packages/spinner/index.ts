import type { VueConstructor } from 'vue'
import Spinner from './src/spinner.vue'

type InstallableSpinner = typeof Spinner & {
  install: (vue: VueConstructor) => void
}

const _Spinner = Spinner as InstallableSpinner

/* istanbul ignore next */
_Spinner.install = function install(Vue: VueConstructor) {
  Vue.component(_Spinner.name, _Spinner)
}

export default _Spinner
