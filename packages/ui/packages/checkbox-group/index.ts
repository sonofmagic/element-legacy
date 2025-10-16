import type { VueConstructor } from 'vue'
import ElCheckboxGroup from '../checkbox/src/checkbox-group.vue'

type InstallableCheckboxGroup = typeof ElCheckboxGroup & {
  install: (vue: VueConstructor) => void
}

const _CheckboxGroup = ElCheckboxGroup as InstallableCheckboxGroup

/* istanbul ignore next */
_CheckboxGroup.install = function install(Vue: VueConstructor) {
  Vue.component(_CheckboxGroup.name, _CheckboxGroup)
}

export default _CheckboxGroup
