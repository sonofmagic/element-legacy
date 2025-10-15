import type { VueConstructor } from 'vue'
import ElDialog from './src/component.vue'

type InstallableElDialog = typeof ElDialog & {
  install: (vue: VueConstructor) => void
}

const _ElDialog = ElDialog as InstallableElDialog

/* istanbul ignore next */
_ElDialog.install = function install(Vue: VueConstructor) {
  Vue.component(_ElDialog.name, _ElDialog)
}

export default _ElDialog
