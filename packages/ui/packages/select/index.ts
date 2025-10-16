import type { VueConstructor } from 'vue'
import Select from './src/select.vue'

type InstallableSelect = typeof Select & {
  install: (vue: VueConstructor) => void
}

const _Select = Select as InstallableSelect

/* istanbul ignore next */
_Select.install = function install(Vue: VueConstructor) {
  Vue.component(_Select.name, _Select)
}

export default _Select
