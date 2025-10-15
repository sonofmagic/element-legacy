import type { VueConstructor } from 'vue'
import DescriptionsItem from '../descriptions/src/descriptions-item'

type InstallableDescriptionsItem = typeof DescriptionsItem & {
  install: (vue: VueConstructor) => void
}

const _DescriptionsItem = DescriptionsItem as InstallableDescriptionsItem

/* istanbul ignore next */
_DescriptionsItem.install = function install(Vue: VueConstructor) {
  Vue.component(_DescriptionsItem.name, _DescriptionsItem)
}

export default _DescriptionsItem
