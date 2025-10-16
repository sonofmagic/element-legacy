import type { VueConstructor } from 'vue'
import ElBreadcrumbItem from '../breadcrumb/src/breadcrumb-item.vue'

type InstallableBreadcrumbItem = typeof ElBreadcrumbItem & {
  install: (vue: VueConstructor) => void
}

const _BreadcrumbItem = ElBreadcrumbItem as InstallableBreadcrumbItem

/* istanbul ignore next */
_BreadcrumbItem.install = function install(Vue: VueConstructor) {
  Vue.component(_BreadcrumbItem.name, _BreadcrumbItem)
}

export default _BreadcrumbItem
