import type { VueConstructor } from 'vue'
import ElIcon from './src/icon.vue'

type InstallableElIcon = typeof ElIcon & {
  install: (vue: VueConstructor) => void
}

const _ElIcon = ElIcon as InstallableElIcon

/* istanbul ignore next */
_ElIcon.install = function install(Vue: VueConstructor) {
  Vue.component(_ElIcon.name, _ElIcon)
}

export default _ElIcon
