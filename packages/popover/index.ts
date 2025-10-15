import type { VueConstructor } from 'vue'
import Vue from 'vue'
import Popover from './src/main.vue'
import directive from './src/directive'

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
