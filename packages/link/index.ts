import type { VueConstructor } from 'vue'
import Link from './src/main.vue'

type InstallableLink = typeof Link & {
  install: (vue: VueConstructor) => void
}

const _Link = Link as InstallableLink

/* istanbul ignore next */
_Link.install = function install(Vue: VueConstructor) {
  Vue.component(_Link.name, _Link)
}

export default _Link
