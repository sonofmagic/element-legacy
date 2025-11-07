import type { VueConstructor } from 'vue'
import Upload from './src/index.vue'
import UploadList from './src/upload-list.vue'

type InstallableUpload = typeof Upload & {
  install: (vue: VueConstructor) => void
}

const _Upload = Upload as InstallableUpload

/* istanbul ignore next */
_Upload.install = function install(Vue: VueConstructor) {
  Vue.component(_Upload.name, _Upload)
}

export {
  UploadList,
}

export default _Upload
