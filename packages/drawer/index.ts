import type { VueConstructor } from 'vue'
import Drawer from './src/main.vue'

type InstallableDrawer = typeof Drawer & {
  install: (vue: VueConstructor) => void
}

const _Drawer = Drawer as InstallableDrawer

/* istanbul ignore next */
_Drawer.install = function install(Vue: VueConstructor) {
  Vue.component(_Drawer.name, _Drawer)
}

export default _Drawer
