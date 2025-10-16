import type { VueConstructor } from 'vue'
import Header from './src/main.vue'

type InstallableHeader = typeof Header & {
  install: (vue: VueConstructor) => void
}

const _Header = Header as InstallableHeader

/* istanbul ignore next */
_Header.install = function install(Vue: VueConstructor) {
  Vue.component(_Header.name, _Header)
}

export default _Header
