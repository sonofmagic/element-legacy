import type { VueConstructor } from 'vue'
import Main from './src/main.vue'

type InstallableMain = typeof Main & {
  install: (vue: VueConstructor) => void
}

const _Main = Main as InstallableMain

/* istanbul ignore next */
_Main.install = function install(Vue: VueConstructor) {
  Vue.component(_Main.name, _Main)
}

export default _Main
