import type { VueConstructor } from 'vue'
import ElMenuItemGroup from '../menu/src/menu-item-group.vue'

type InstallableElMenuItemGroup = typeof ElMenuItemGroup & {
  install: (vue: VueConstructor) => void
}

const _ElMenuItemGroup = ElMenuItemGroup as InstallableElMenuItemGroup

/* istanbul ignore next */
_ElMenuItemGroup.install = function install(Vue: VueConstructor) {
  Vue.component(_ElMenuItemGroup.name, _ElMenuItemGroup)
}

export default _ElMenuItemGroup
