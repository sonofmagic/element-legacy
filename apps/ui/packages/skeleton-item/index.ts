import type { VueConstructor } from 'vue'
import SkeletonItem from '../skeleton/src/item.vue'

type InstallableSkeletonItem = typeof SkeletonItem & {
  install: (vue: VueConstructor) => void
}

const _SkeletonItem = SkeletonItem as InstallableSkeletonItem

/* istanbul ignore next */
_SkeletonItem.install = function install(Vue: VueConstructor) {
  Vue.component(_SkeletonItem.name, _SkeletonItem)
}

export default _SkeletonItem
