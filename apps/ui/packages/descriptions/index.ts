import type { VueConstructor } from 'vue'
import Descriptions from './src/index'

type InstallableDescriptions = typeof Descriptions & {
  install: (vue: VueConstructor) => void
}

const _Descriptions = Descriptions as InstallableDescriptions

/* istanbul ignore next */
_Descriptions.install = function install(Vue: VueConstructor) {
  Vue.component(_Descriptions.name, _Descriptions)
}

export default _Descriptions
