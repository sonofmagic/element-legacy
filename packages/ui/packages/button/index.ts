import type { VueConstructor } from 'vue'
import ElButton from './src/button.vue'

type InstallableButton = typeof ElButton & {
  install: (vue: VueConstructor) => void
}

const _Button = ElButton as InstallableButton

/* istanbul ignore next */
_Button.install = function install(Vue: VueConstructor) {
  Vue.component(_Button.name, _Button)
}

export default _Button
