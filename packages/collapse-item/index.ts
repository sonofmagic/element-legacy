import type { VueConstructor } from 'vue'
import ElCollapseItem from '../collapse/src/collapse-item.vue'

type InstallableCollapseItem = typeof ElCollapseItem & {
  install: (vue: VueConstructor) => void
}

const _CollapseItem = ElCollapseItem as InstallableCollapseItem

/* istanbul ignore next */
_CollapseItem.install = function install(Vue: VueConstructor) {
  Vue.component(_CollapseItem.name, _CollapseItem)
}

export default _CollapseItem
