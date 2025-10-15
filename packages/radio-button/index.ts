import type { VueConstructor } from 'vue'
import RadioButton from '../radio/src/radio-button.vue'

type InstallableRadioButton = typeof RadioButton & {
  install: (vue: VueConstructor) => void
}

const _RadioButton = RadioButton as InstallableRadioButton

/* istanbul ignore next */
_RadioButton.install = function install(Vue: VueConstructor) {
  Vue.component(_RadioButton.name, _RadioButton)
}

export default _RadioButton
