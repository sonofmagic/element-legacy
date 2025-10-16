import type { VueConstructor } from 'vue'
import ElSubmenu from '../menu/src/submenu.vue'

type InstallableElSubmenu = typeof ElSubmenu & {
  install: (vue: VueConstructor) => void
}

const _ElSubmenu = ElSubmenu as InstallableElSubmenu

/* istanbul ignore next */
_ElSubmenu.install = function install(Vue: VueConstructor) {
  Vue.component(_ElSubmenu.name, _ElSubmenu)
}

export default _ElSubmenu
