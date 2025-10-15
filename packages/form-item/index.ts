import type { VueConstructor } from 'vue'
import ElFormItem from '../form/src/form-item.vue'

type InstallableElFormItem = typeof ElFormItem & {
  install: (vue: VueConstructor) => void
}

const _ElFormItem = ElFormItem as InstallableElFormItem

/* istanbul ignore next */
_ElFormItem.install = function install(Vue: VueConstructor) {
  Vue.component(_ElFormItem.name, _ElFormItem)
}

export default _ElFormItem
