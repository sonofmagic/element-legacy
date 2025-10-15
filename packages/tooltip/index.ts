import type { VueConstructor } from 'vue'
import Tooltip from './src/main'

type InstallableTooltip = typeof Tooltip & {
  install: (vue: VueConstructor) => void
}

const _Tooltip = Tooltip as InstallableTooltip

/* istanbul ignore next */
_Tooltip.install = function install(Vue: VueConstructor) {
  Vue.component(_Tooltip.name, _Tooltip)
}

export default _Tooltip
