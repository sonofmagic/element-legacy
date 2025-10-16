import type { VueConstructor } from 'vue'
import ElDropdownMenu from '../dropdown/src/dropdown-menu.vue'

type InstallableElDropdownMenu = typeof ElDropdownMenu & {
  install: (vue: VueConstructor) => void
}

const _ElDropdownMenu = ElDropdownMenu as InstallableElDropdownMenu

/* istanbul ignore next */
_ElDropdownMenu.install = function install(Vue: VueConstructor) {
  Vue.component(_ElDropdownMenu.name, _ElDropdownMenu)
}

export default _ElDropdownMenu
