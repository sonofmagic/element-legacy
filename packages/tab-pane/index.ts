import type { VueConstructor } from 'vue'
import TabPane from '../tabs/src/tab-pane.vue'

type InstallableTabPane = typeof TabPane & {
  install: (vue: VueConstructor) => void
}

const _TabPane = TabPane as InstallableTabPane

/* istanbul ignore next */
_TabPane.install = function install(Vue: VueConstructor) {
  Vue.component(_TabPane.name, _TabPane)
}

export default _TabPane
