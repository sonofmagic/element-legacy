import type { VueConstructor } from 'vue'
import Popconfirm from './src/main.vue'

type InstallablePopconfirm = typeof Popconfirm & {
  install: (vue: VueConstructor) => void
}

const _Popconfirm = Popconfirm as InstallablePopconfirm

/* istanbul ignore next */
_Popconfirm.install = function install(Vue: VueConstructor) {
  Vue.component(_Popconfirm.name, _Popconfirm)
}

export default _Popconfirm
