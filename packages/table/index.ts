import type { VueConstructor } from 'vue'
import ElTable from './src/table.vue'

type InstallableElTable = typeof ElTable & {
  install: (vue: VueConstructor) => void
}

const _ElTable = ElTable as InstallableElTable

/* istanbul ignore next */
_ElTable.install = function install(Vue: VueConstructor) {
  Vue.component(_ElTable.name, _ElTable)
}

export default _ElTable
