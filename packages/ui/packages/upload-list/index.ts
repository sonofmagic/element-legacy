import type { VueConstructor } from 'vue'
import UploadList from '../upload/src/upload-list.vue'

type InstallableUploadList = typeof UploadList & {
  install: (vue: VueConstructor) => void
}

const _UploadList = UploadList as InstallableUploadList

/* istanbul ignore next */
_UploadList.install = function install(Vue: VueConstructor) {
  Vue.component(_UploadList.name, _UploadList)
}

export default _UploadList
