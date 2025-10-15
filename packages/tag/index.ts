import type { VueConstructor } from 'vue'
import ElTag from './src/tag.vue'

type InstallableElTag = typeof ElTag & {
  install: (vue: VueConstructor) => void
}

const _ElTag = ElTag as InstallableElTag

/* istanbul ignore next */
_ElTag.install = function install(Vue: VueConstructor) {
  Vue.component(_ElTag.name, _ElTag)
}

export default _ElTag
