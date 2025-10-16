import type { VueConstructor } from 'vue'
import ElDropdownItem from '../dropdown/src/dropdown-item.vue'

type InstallableElDropdownItem = typeof ElDropdownItem & {
  install: (vue: VueConstructor) => void
}

const _ElDropdownItem = ElDropdownItem as InstallableElDropdownItem

/* istanbul ignore next */
_ElDropdownItem.install = function install(Vue: VueConstructor) {
  Vue.component(_ElDropdownItem.name, _ElDropdownItem)
}

export default _ElDropdownItem
