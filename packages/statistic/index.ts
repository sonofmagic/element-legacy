import type { VueConstructor } from 'vue'
import Statistic from './src/main.vue'

type InstallableStatistic = typeof Statistic & {
  install: (vue: VueConstructor) => void
}

const _Statistic = Statistic as InstallableStatistic

/* istanbul ignore next */
_Statistic.install = function install(Vue: VueConstructor) {
  Vue.component(_Statistic.name, _Statistic)
}

export default _Statistic
