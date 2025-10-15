<script>
import Vue from 'vue'
import * as compiler from 'vue-template-compiler'
import { stripScript, stripStyle, stripTemplate } from '../util'
import DemoBlock from './demo-block.vue'

function unwrapTemplate(code) {
  if (!code) {
    return ''
  }
  return code
    .replace(/^<template>/, '')
    .replace(/<\/template>$/, '')
    .trim()
}

export default {
  name: 'Demo',
  components: {
    DemoBlock,
  },
  props: {
    source: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      demoComponent: null,
      styleTag: null,
    }
  },
  computed: {
    decodedSource() {
      return this.source ? decodeURIComponent(this.source) : ''
    },
    decodedDescription() {
      return this.description ? decodeURIComponent(this.description) : ''
    },
  },
  watch: {
    decodedSource: {
      immediate: true,
      handler() {
        this.compileDemo()
      },
    },
  },
  beforeDestroy() {
    this.teardownStyle()
  },
  methods: {
    teardownStyle() {
      if (this.styleTag && this.styleTag.parentNode) {
        this.styleTag.parentNode.removeChild(this.styleTag)
        this.styleTag = null
      }
    },
    compileDemo() {
      const raw = this.decodedSource
      if (!raw || !raw.trim()) {
        this.demoComponent = null
        this.teardownStyle()
        return
      }

      const templateBlock = stripTemplate(raw)
      const scriptBlock = stripScript(raw)
      const styleBlock = stripStyle(raw)

      this.teardownStyle()
      if (styleBlock) {
        this.styleTag = document.createElement('style')
        this.styleTag.innerHTML = styleBlock
        document.head.appendChild(this.styleTag)
      }

      let scriptExports = {}
      if (scriptBlock) {
        try {
          scriptExports
            // eslint-disable-next-line no-new-func
            = new Function(scriptBlock.replace(/export\s+default/, 'return '))() || {}
        }
        catch (_error) {
          this.demoComponent = null
          return
        }
      }

      const templateContent = unwrapTemplate(templateBlock) || templateBlock
      let compiled
      try {
        compiled = compiler.compileToFunctions(`<div>${templateContent}</div>`)
      }
      catch (_error) {
        this.demoComponent = null
        return
      }
      const componentOptions = {
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns,
        ...scriptExports,
      }

      this.demoComponent = Vue.extend(componentOptions)
    },
  },
}
</script>

<template>
  <DemoBlock>
    <template #source>
      <component :is="demoComponent" v-if="demoComponent" />
    </template>
    <template v-if="decodedDescription" #default>
      <div v-html="decodedDescription" />
    </template>
    <template #highlight>
      <slot />
    </template>
  </DemoBlock>
</template>
