import type { VueConstructor } from 'vue'
import CascaderPanel from './src/cascader-panel.vue'

type InstallableCascaderPanel = typeof CascaderPanel & {
  install: (vue: VueConstructor) => void
}

const _CascaderPanel = CascaderPanel as InstallableCascaderPanel

/* istanbul ignore next */
_CascaderPanel.install = function install(Vue: VueConstructor) {
  Vue.component(_CascaderPanel.name, _CascaderPanel)
}

export default _CascaderPanel
