<script>
import { use } from 'main/locale'
import enLocale from 'main/locale/lang/en'
import esLocale from 'main/locale/lang/es'
import frLocale from 'main/locale/lang/fr'
import zhLocale from 'main/locale/lang/zh-CN'

const lang = location.hash.replace('#', '').split('/')[1] || 'zh-CN'
function localize(lang) {
  switch (lang) {
    case 'zh-CN':
      use(zhLocale)
      break
    case 'es':
      use(esLocale)
      break
    case 'fr-FR':
      use(frLocale)
      break
    default:
      use(enLocale)
  }
}
localize(lang)

export default {
  name: 'App',

  computed: {
    lang() {
      return this.$route.path.split('/')[1] || 'zh-CN'
    },
    isComponent() {
      return (this.$route.name || '').startsWith('component-')
    },
  },

  watch: {
    lang(val) {
      if (val === 'zh-CN') {
        this.suggestJump()
      }
      localize(val)
    },
  },

  mounted() {
    localize(this.lang)
    if (this.lang === 'zh-CN') {
      this.suggestJump()
    }
  },

  methods: {
    suggestJump() {
      if (process.env.NODE_ENV !== 'production') { return }

      const href = location.href
      const preferGithub = localStorage.getItem('PREFER_GITHUB')
      const cnHref = href.includes('eleme.cn') || href.includes('element-cn') || href.includes('element.faas')
      if (cnHref || preferGithub) { return }
      setTimeout(() => {
        if (this.lang !== 'zh-CN') { return }
        this.$confirm('建议大陆用户访问部署在国内的站点，是否跳转？', '提示')
          .then(() => {
            location.replace('https://element.eleme.cn')
          })
          .catch(() => {
            localStorage.setItem('PREFER_GITHUB', 'true')
          })
      }, 1000)
    },
  },
}
</script>

<template>
  <div id="app" :class="{ 'is-component': isComponent }">
    <main-header v-if="lang !== 'play'" />
    <div class="main-cnt">
      <router-view />
    </div>
    <main-footer v-if="lang !== 'play' && !isComponent" />
  </div>
</template>
