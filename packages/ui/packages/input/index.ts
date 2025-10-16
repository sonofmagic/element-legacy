import type { VueConstructor } from 'vue'
import ElInput from './src/input.vue'

type InstallableElInput = typeof ElInput & {
  install: (vue: VueConstructor) => void
}

const _ElInput = ElInput as InstallableElInput

/* istanbul ignore next */
_ElInput.install = function install(Vue: VueConstructor) {
  Vue.component(_ElInput.name, _ElInput)
}

export default _ElInput
