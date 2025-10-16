import type { VueConstructor } from 'vue'
import DatePicker from './src/picker/date-picker'

type InstallableDatePicker = typeof DatePicker & {
  install: (vue: VueConstructor) => void
}

const _DatePicker = DatePicker as InstallableDatePicker

/* istanbul ignore next */
_DatePicker.install = function install(Vue: VueConstructor) {
  Vue.component(_DatePicker.name, _DatePicker)
}

export default _DatePicker
