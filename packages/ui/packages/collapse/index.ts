import type { VueConstructor } from 'vue'
import ElCollapse from './src/collapse.vue'

type InstallableCollapse = typeof ElCollapse & {
  install: (vue: VueConstructor) => void
}

const _Collapse = ElCollapse as InstallableCollapse

/* istanbul ignore next */
_Collapse.install = function install(Vue: VueConstructor) {
  Vue.component(_Collapse.name, _Collapse)
}

export default _Collapse
