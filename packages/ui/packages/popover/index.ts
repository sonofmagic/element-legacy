import type { VueConstructor } from 'vue'
import Vue from 'element-legacy/src/utils/vue'
import directive from './src/directive'
import Popover from './src/main.vue'

type InstallablePopover = typeof Popover & {
  install: (vue: VueConstructor) => void
  directive: typeof directive
}

const _Popover = Popover as InstallablePopover

Vue.directive('popover', directive)

/* istanbul ignore next */
_Popover.install = function install(VueInstance: VueConstructor) {
  VueInstance.directive('popover', directive)
  VueInstance.component(_Popover.name, _Popover)
}
_Popover.directive = directive

export default _Popover
