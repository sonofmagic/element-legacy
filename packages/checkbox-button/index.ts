import type { VueConstructor } from 'vue'
import ElCheckboxButton from '../checkbox/src/checkbox-button.vue'

type InstallableCheckboxButton = typeof ElCheckboxButton & {
  install: (vue: VueConstructor) => void
}

const _CheckboxButton = ElCheckboxButton as InstallableCheckboxButton

/* istanbul ignore next */
_CheckboxButton.install = function install(Vue: VueConstructor) {
  Vue.component(_CheckboxButton.name, _CheckboxButton)
}

export default _CheckboxButton
