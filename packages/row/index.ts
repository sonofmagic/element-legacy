import type { VueConstructor } from 'vue'
import Row from './src/row'

type InstallableRow = typeof Row & {
  install: (vue: VueConstructor) => void
}

const _Row = Row as InstallableRow

/* istanbul ignore next */
_Row.install = function install(Vue: VueConstructor) {
  Vue.component(_Row.name, _Row)
}

export default _Row
