import type { VueConstructor } from 'vue'
import Cascader from './src/cascader.vue'

type InstallableCascader = typeof Cascader & {
  install: (vue: VueConstructor) => void
}

const _Cascader = Cascader as InstallableCascader

/* istanbul ignore next */
_Cascader.install = function install(Vue: VueConstructor) {
  Vue.component(_Cascader.name, _Cascader)
}

export default _Cascader
