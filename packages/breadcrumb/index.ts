import type { VueConstructor } from 'vue'
import ElBreadcrumb from './src/breadcrumb.vue'

type InstallableBreadcrumb = typeof ElBreadcrumb & {
  install: (vue: VueConstructor) => void
}

const _Breadcrumb = ElBreadcrumb as InstallableBreadcrumb

/* istanbul ignore next */
_Breadcrumb.install = function install(Vue: VueConstructor) {
  Vue.component(_Breadcrumb.name, _Breadcrumb)
}

export default _Breadcrumb
