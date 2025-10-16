import type { VueConstructor } from 'vue'
import Empty from './src/index.vue'

type InstallableEmpty = typeof Empty & {
  install: (vue: VueConstructor) => void
}

const _Empty = Empty as InstallableEmpty

/* istanbul ignore next */
_Empty.install = function install(Vue: VueConstructor) {
  Vue.component(_Empty.name, _Empty)
}

export default _Empty
