import type { VueConstructor } from 'vue'
import DatePickerV2 from './src/picker/date-picker'

type InstallableDatePickerV2 = typeof DatePickerV2 & {
  install: (vue: VueConstructor) => void
}

const _DatePickerV2 = DatePickerV2 as InstallableDatePickerV2

/* istanbul ignore next */
_DatePickerV2.install = function install(Vue: VueConstructor) {
  Vue.component(_DatePickerV2.name, _DatePickerV2)
}

export default _DatePickerV2
