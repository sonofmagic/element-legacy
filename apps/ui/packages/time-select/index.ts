import type { VueConstructor } from 'vue'
import TimeSelect from '../date-picker/src/picker/time-select'

type InstallableTimeSelect = typeof TimeSelect & {
  install: (vue: VueConstructor) => void
}

const _TimeSelect = TimeSelect as InstallableTimeSelect

/* istanbul ignore next */
_TimeSelect.install = function install(Vue: VueConstructor) {
  Vue.component(_TimeSelect.name, _TimeSelect)
}

export default _TimeSelect
