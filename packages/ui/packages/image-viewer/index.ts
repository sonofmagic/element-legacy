import type { VueConstructor } from 'vue'
import ImageViewer from '../image/src/image-viewer.vue'

type InstallableImageViewer = typeof ImageViewer & {
  install: (vue: VueConstructor) => void
}

const _ImageViewer = ImageViewer as InstallableImageViewer

/* istanbul ignore next */
_ImageViewer.install = function install(Vue: VueConstructor) {
  Vue.component(_ImageViewer.name, _ImageViewer)
}

export default _ImageViewer
