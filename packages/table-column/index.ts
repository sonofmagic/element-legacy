import type { VueConstructor } from 'vue'
import ElTableColumn from '../table/src/table-column'

type InstallableElTableColumn = typeof ElTableColumn & {
  install: (vue: VueConstructor) => void
}

const _ElTableColumn = ElTableColumn as InstallableElTableColumn

/* istanbul ignore next */
_ElTableColumn.install = function install(Vue: VueConstructor) {
  Vue.component(_ElTableColumn.name, _ElTableColumn)
}

export default _ElTableColumn
