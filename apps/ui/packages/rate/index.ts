import type { VueConstructor } from 'vue'
import Rate from './src/main.vue'

type InstallableRate = typeof Rate & {
  install: (vue: VueConstructor) => void
}

const _Rate = Rate as InstallableRate

/* istanbul ignore next */
_Rate.install = function install(Vue: VueConstructor) {
  Vue.component(_Rate.name, _Rate)
}

export default _Rate
