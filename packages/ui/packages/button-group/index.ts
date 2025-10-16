import type { VueConstructor } from 'vue'
import ElButtonGroup from '../button/src/button-group.vue'

type InstallableButtonGroup = typeof ElButtonGroup & {
  install: (vue: VueConstructor) => void
}

const _ButtonGroup = ElButtonGroup as InstallableButtonGroup

/* istanbul ignore next */
_ButtonGroup.install = function install(Vue: VueConstructor) {
  Vue.component(_ButtonGroup.name, _ButtonGroup)
}

export default _ButtonGroup
