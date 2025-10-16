import type { VueConstructor } from 'vue'
import Result from './src/index.vue'

type InstallableResult = typeof Result & {
  install: (vue: VueConstructor) => void
}

const _Result = Result as InstallableResult

/* istanbul ignore next */
_Result.install = function install(Vue: VueConstructor) {
  Vue.component(_Result.name, _Result)
}

export default _Result
