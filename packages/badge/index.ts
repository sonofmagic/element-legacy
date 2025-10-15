import type { VueConstructor } from 'vue'
import Badge from './src/main.vue'

type InstallableBadge = typeof Badge & {
  install: (vue: VueConstructor) => void
}

const _Badge = Badge as InstallableBadge

/* istanbul ignore next */
_Badge.install = function install(Vue: VueConstructor) {
  Vue.component(_Badge.name, _Badge)
}

export default _Badge
