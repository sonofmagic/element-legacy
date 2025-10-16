import type { VueConstructor } from 'vue'
import Avatar from './src/main.vue'

type InstallableAvatar = typeof Avatar & {
  install: (vue: VueConstructor) => void
}

const _Avatar = Avatar as InstallableAvatar

/* istanbul ignore next */
_Avatar.install = function install(Vue: VueConstructor) {
  Vue.component(_Avatar.name, _Avatar)
}

export default _Avatar
