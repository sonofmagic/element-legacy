import type { VueConstructor } from 'vue'
import ElProgress from './src/progress.vue'

type InstallableElProgress = typeof ElProgress & {
  install: (vue: VueConstructor) => void
}

const _ElProgress = ElProgress as InstallableElProgress

/* istanbul ignore next */
_ElProgress.install = function install(Vue: VueConstructor) {
  Vue.component(_ElProgress.name, _ElProgress)
}

export default _ElProgress
