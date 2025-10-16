import type { VueConstructor } from 'vue'
import Transfer from './src/main.vue'

type InstallableTransfer = typeof Transfer & {
  install: (vue: VueConstructor) => void
}

const _Transfer = Transfer as InstallableTransfer

/* istanbul ignore next */
_Transfer.install = function install(Vue: VueConstructor) {
  Vue.component(_Transfer.name, _Transfer)
}

export default _Transfer
