import hljs from 'highlight.js'
import Vue, { type ComponentOptions } from 'vue'
import VueRouter, { type Route } from 'vue-router'
import Element from '../src/index'
import entry from './app.vue'
import demoBlock from './components/demo-block.vue'
import Demo from './components/Demo.vue'
import FooterNav from './components/footer-nav.vue'
import MainFooter from './components/footer.vue'
import MainHeader from './components/header.vue'
import SideNav from './components/side-nav.vue'
import title from './i18n/title.json'
import icon from './icon.json'

import routes from './route.config'
import '../packages/theme-chalk/src/index.scss'
import './demo-styles/index.scss'
import './assets/styles/common.css'
import './assets/styles/fonts/style.css'

declare module 'vue/types/vue' {
  interface Vue {
    $icon: typeof icon
    $isEle: boolean
  }
}

Vue.use(Element)
Vue.use(VueRouter)
Vue.component('demo-block', demoBlock)
Vue.component('Demo', Demo)
Vue.component('main-footer', MainFooter)
Vue.component('main-header', MainHeader)
Vue.component('side-nav', SideNav)
Vue.component('footer-nav', FooterNav)

const globalEle = new Vue({
  data() {
    return { $isEle: false } // 是否 ele 用户
  },
})

Vue.mixin({
  computed: {
    $isEle: {
      get: () => (globalEle.$data.$isEle),
      set: (data: boolean) => { globalEle.$data.$isEle = data },
    },
  },
})

Vue.prototype.$icon = icon // Icon 列表页用

const router = new VueRouter({
  mode: 'history',
  // base: __dirname,
  routes,
})

router.afterEach((route: Route) => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll<HTMLElement>('pre code:not(.hljs)')
    blocks.forEach((block) => {
      hljs.highlightBlock(block)
    })
  })
  const lang = (route.meta?.lang as keyof typeof title) || 'en-US'
  const data = title[lang]
  if (data) {
    for (const key of Object.keys(data)) {
      const pattern = new RegExp(`^${key}`, 'g')
      if (pattern.test(route.name || '')) {
        document.title = data[key]
        return
      }
    }
    const fallback = route.meta?.title as keyof typeof data | undefined
    if (fallback && data[fallback]) {
      document.title = data[fallback]
      return
    }
  }
  document.title = 'Element'
})

const appOptions = entry as ComponentOptions<Vue>

new Vue({
  ...appOptions,
  router,
}).$mount('#app')
