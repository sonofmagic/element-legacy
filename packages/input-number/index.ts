import type { VueConstructor } from 'vue'
import ElInputNumber from './src/input-number.vue'

type InstallableElInputNumber = typeof ElInputNumber & {
  install: (vue: VueConstructor) => void
}

const _ElInputNumber = ElInputNumber as InstallableElInputNumber

/* istanbul ignore next */
_ElInputNumber.install = function install(Vue: VueConstructor) {
  Vue.component(_ElInputNumber.name, _ElInputNumber)
}

export default _ElInputNumber
