import type { VueConstructor } from 'vue'
import ElTabs from './src/tabs.vue'

type InstallableElTabs = typeof ElTabs & {
  install: (vue: VueConstructor) => void
}

const _ElTabs = ElTabs as InstallableElTabs

/* istanbul ignore next */
_ElTabs.install = function install(Vue: VueConstructor) {
  Vue.component(_ElTabs.name, _ElTabs)
}

export default _ElTabs
