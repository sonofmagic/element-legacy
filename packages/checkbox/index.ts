import type { VueConstructor } from 'vue'
import ElCheckbox from './src/checkbox.vue'

type InstallableCheckbox = typeof ElCheckbox & {
  install: (vue: VueConstructor) => void
}

const _Checkbox = ElCheckbox as InstallableCheckbox

/* istanbul ignore next */
_Checkbox.install = function install(Vue: VueConstructor) {
  Vue.component(_Checkbox.name, _Checkbox)
}

export default _Checkbox
