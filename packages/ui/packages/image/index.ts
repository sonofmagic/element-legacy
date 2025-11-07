import type { VueConstructor } from 'vue'
import ImageViewer from './src/image-viewer.vue'
import Image from './src/main.vue'

type InstallableImage = typeof Image & {
  install: (vue: VueConstructor) => void
}

const _Image = Image as InstallableImage

/* istanbul ignore next */
_Image.install = function install(Vue: VueConstructor) {
  Vue.component(_Image.name, _Image)
}

export {
  ImageViewer,
}

export default _Image
