import type { VueConstructor } from 'vue'
import ElOption from '../select/src/option.vue'

type InstallableElOption = typeof ElOption & {
  install: (vue: VueConstructor) => void
}

const _ElOption = ElOption as InstallableElOption

/* istanbul ignore next */
_ElOption.install = function install(Vue: VueConstructor) {
  Vue.component(_ElOption.name, _ElOption)
}

export default _ElOption
