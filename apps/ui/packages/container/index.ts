import type { VueConstructor } from 'vue'
import Container from './src/main.vue'

type InstallableContainer = typeof Container & {
  install: (vue: VueConstructor) => void
}

const _Container = Container as InstallableContainer

/* istanbul ignore next */
_Container.install = function install(Vue: VueConstructor) {
  Vue.component(_Container.name, _Container)
}

export default _Container
