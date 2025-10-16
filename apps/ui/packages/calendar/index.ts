import type { VueConstructor } from 'vue'
import Calendar from './src/main.vue'

type InstallableCalendar = typeof Calendar & {
  install: (vue: VueConstructor) => void
}

const _Calendar = Calendar as InstallableCalendar

/* istanbul ignore next */
_Calendar.install = function install(Vue: VueConstructor) {
  Vue.component(_Calendar.name, _Calendar)
}

export default _Calendar
