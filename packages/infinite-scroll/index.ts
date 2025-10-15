import type { VueConstructor } from 'vue'
import InfiniteScroll from './src/main.js'

type InstallableInfiniteScroll = typeof InfiniteScroll & {
  install: (vue: VueConstructor) => void
}

const _InfiniteScroll = InfiniteScroll as InstallableInfiniteScroll

/* istanbul ignore next */
_InfiniteScroll.install = function install(Vue: VueConstructor) {
  Vue.directive(_InfiniteScroll.name, _InfiniteScroll)
}

export default _InfiniteScroll
