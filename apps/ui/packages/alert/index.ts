import type { VueConstructor } from 'vue'
import Alert from './src/main.vue'

type InstallableAlert = typeof Alert & {
  install: (vue: VueConstructor) => void
}

const _Alert = Alert as InstallableAlert

/* istanbul ignore next */
_Alert.install = function install(Vue: VueConstructor) {
  Vue.component(_Alert.name, _Alert)
}

export default _Alert
