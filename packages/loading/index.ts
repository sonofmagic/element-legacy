import type { VueConstructor } from 'vue'
import directive from './src/directive'
import service from './src/index'

const Loading = {
  install(Vue: VueConstructor) {
    Vue.use(directive as any)
    const proto = Vue.prototype as Record<string, unknown>
    proto.$loading = service
  },
  directive,
  service,
}

export default Loading
