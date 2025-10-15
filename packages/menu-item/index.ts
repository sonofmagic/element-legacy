import type { VueConstructor } from 'vue'
import ElMenuItem from '../menu/src/menu-item.vue'

type InstallableElMenuItem = typeof ElMenuItem & {
  install: (vue: VueConstructor) => void
}

const _ElMenuItem = ElMenuItem as InstallableElMenuItem

/* istanbul ignore next */
_ElMenuItem.install = function install(Vue: VueConstructor) {
  Vue.component(_ElMenuItem.name, _ElMenuItem)
}

export default _ElMenuItem
