import type { VueConstructor } from 'vue'
import TimePicker from '../date-picker/src/picker/time-picker'

type InstallableTimePicker = typeof TimePicker & {
  install: (vue: VueConstructor) => void
}

const _TimePicker = TimePicker as InstallableTimePicker

/* istanbul ignore next */
_TimePicker.install = function install(Vue: VueConstructor) {
  Vue.component(_TimePicker.name, _TimePicker)
}

export default _TimePicker
