import type { VueConstructor } from 'vue'
import ElAutocomplete from './src/autocomplete.vue'

type InstallableAutocomplete = typeof ElAutocomplete & {
  install: (vue: VueConstructor) => void
}

const _Autocomplete = ElAutocomplete as InstallableAutocomplete

/* istanbul ignore next */
_Autocomplete.install = function install(Vue: VueConstructor) {
  Vue.component(_Autocomplete.name, _Autocomplete)
}

export default _Autocomplete
