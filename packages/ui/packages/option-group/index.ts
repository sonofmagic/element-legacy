import type { VueConstructor } from 'vue'
import ElOptionGroup from '../select/src/option-group.vue'

type InstallableElOptionGroup = typeof ElOptionGroup & {
  install: (vue: VueConstructor) => void
}

const _ElOptionGroup = ElOptionGroup as InstallableElOptionGroup

/* istanbul ignore next */
_ElOptionGroup.install = function install(Vue: VueConstructor) {
  Vue.component(_ElOptionGroup.name, _ElOptionGroup)
}

export default _ElOptionGroup
