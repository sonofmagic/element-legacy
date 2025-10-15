import type { VueConstructor } from 'vue'
import Switch from './src/component.vue'

type InstallableSwitch = typeof Switch & {
  install: (vue: VueConstructor) => void
}

const _Switch = Switch as InstallableSwitch

/* istanbul ignore next */
_Switch.install = function install(Vue: VueConstructor) {
  Vue.component(_Switch.name, _Switch)
}

export default _Switch
