import type { VueConstructor } from 'vue'
import DateTable from '../date-picker/src/basic/date-table.vue'

type InstallableDateTable = typeof DateTable & {
  install: (vue: VueConstructor) => void
}

const _DateTable = DateTable as InstallableDateTable

/* istanbul ignore next */
_DateTable.install = function install(Vue: VueConstructor) {
  Vue.component(_DateTable.name, _DateTable)
}

export default _DateTable
