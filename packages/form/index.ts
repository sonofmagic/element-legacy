import type { VueConstructor } from 'vue'
import ElForm from './src/form.vue'

type InstallableElForm = typeof ElForm & {
  install: (vue: VueConstructor) => void
}

const _ElForm = ElForm as InstallableElForm

/* istanbul ignore next */
_ElForm.install = function install(Vue: VueConstructor) {
  Vue.component(_ElForm.name, _ElForm)
}

export default _ElForm
