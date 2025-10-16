import type { VueConstructor } from 'vue'
import Step from '../steps/src/step.vue'

type InstallableStep = typeof Step & {
  install: (vue: VueConstructor) => void
}

const _Step = Step as InstallableStep

/* istanbul ignore next */
_Step.install = function install(Vue: VueConstructor) {
  Vue.component(_Step.name, _Step)
}

export default _Step
