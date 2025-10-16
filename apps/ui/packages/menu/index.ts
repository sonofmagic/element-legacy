import type { VueConstructor } from 'vue'
import ElMenu from './src/menu.vue'

type InstallableElMenu = typeof ElMenu & {
  install: (vue: VueConstructor) => void
}

const _ElMenu = ElMenu as InstallableElMenu

/* istanbul ignore next */
_ElMenu.install = function install(Vue: VueConstructor) {
  Vue.component(_ElMenu.name, _ElMenu)
}

export default _ElMenu
