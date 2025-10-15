import type { VueConstructor } from 'vue'
import RadioGroup from '../radio/src/radio-group.vue'

type InstallableRadioGroup = typeof RadioGroup & {
  install: (vue: VueConstructor) => void
}

const _RadioGroup = RadioGroup as InstallableRadioGroup

/* istanbul ignore next */
_RadioGroup.install = function install(Vue: VueConstructor) {
  Vue.component(_RadioGroup.name, _RadioGroup)
}

export default _RadioGroup
