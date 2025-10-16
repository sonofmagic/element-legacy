import type { VueConstructor } from 'vue'
import PageHeader from './src/main.vue'

type InstallablePageHeader = typeof PageHeader & {
  install: (vue: VueConstructor) => void
}

const _PageHeader = PageHeader as InstallablePageHeader

/* istanbul ignore next */
_PageHeader.install = function install(Vue: VueConstructor) {
  Vue.component(_PageHeader.name, _PageHeader)
}

export default _PageHeader
