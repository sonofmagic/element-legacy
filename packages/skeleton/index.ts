import type { VueConstructor } from 'vue'
import Skeleton from './src/index.vue'

type InstallableSkeleton = typeof Skeleton & {
  install: (vue: VueConstructor) => void
}

const _Skeleton = Skeleton as InstallableSkeleton

/* istanbul ignore next */
_Skeleton.install = function install(Vue: VueConstructor) {
  Vue.component(_Skeleton.name, _Skeleton)
}

export default _Skeleton
