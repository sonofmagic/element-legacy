import type { VueConstructor } from 'vue'
import Steps from './src/steps.vue'

type InstallableSteps = typeof Steps & {
  install: (vue: VueConstructor) => void
}

const _Steps = Steps as InstallableSteps

/* istanbul ignore next */
_Steps.install = function install(Vue: VueConstructor) {
  Vue.component(_Steps.name, _Steps)
}

export default _Steps
