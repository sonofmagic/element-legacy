import type { VueConstructor } from 'vue'
import Pagination from './src/pagination'

type InstallablePagination = typeof Pagination & {
  install: (vue: VueConstructor) => void
}

const _Pagination = Pagination as InstallablePagination

/* istanbul ignore next */
_Pagination.install = function install(Vue: VueConstructor) {
  Vue.component(_Pagination.name, _Pagination)
}

export default _Pagination
