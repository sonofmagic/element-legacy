import type { VueConstructor } from 'vue'
import ElDropdown from './src/dropdown.vue'

type InstallableElDropdown = typeof ElDropdown & {
  install: (vue: VueConstructor) => void
}

const _ElDropdown = ElDropdown as InstallableElDropdown

/* istanbul ignore next */
_ElDropdown.install = function install(Vue: VueConstructor) {
  Vue.component(_ElDropdown.name, _ElDropdown)
}

export default _ElDropdown
