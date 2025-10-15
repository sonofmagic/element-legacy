import type { VueConstructor } from 'vue'
import ElCol from './src/col'

type InstallableCol = typeof ElCol & {
  install: (vue: VueConstructor) => void
}

const _Col = ElCol as InstallableCol

/* istanbul ignore next */
_Col.install = function install(Vue: VueConstructor) {
  Vue.component(_Col.name, _Col)
}

export default _Col
