<script>
import Vue from 'vue'
import * as compiler from 'vue-template-compiler'
import { stripScript, stripStyle, stripTemplate } from '../util'
import DemoBlock from './demo-block.vue'

// Demo payloads are base64-encoded UTF-8; decode safely so non-ASCII text renders correctly.
function decodeBase64Utf8(payload) {
  if (!payload) {
    return ''
  }

  try {
    if (typeof atob === 'function') {
      const binary = atob(payload)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      if (typeof TextDecoder === 'function') {
        try {
          return new TextDecoder('utf-8').decode(bytes)
        }
        catch (_error) {}
      }

      const percentEncoded = []
      for (let i = 0; i < bytes.length; i++) {
        percentEncoded.push(`%${bytes[i].toString(16).padStart(2, '0')}`)
      }
      return decodeURIComponent(percentEncoded.join(''))
    }
  }
  catch (_error) {}

  try {
    /* eslint-disable node/prefer-global/buffer */
    if (typeof Buffer === 'function' && typeof Buffer.from === 'function') {
      return Buffer.from(payload, 'base64').toString()
    }
    /* eslint-enable node/prefer-global/buffer */
  }
  catch (_error) {}

  return ''
}

function decodePayload(raw) {
  if (!raw) {
    return ''
  }
  const cleaned = raw.trim()
  if (!cleaned) {
    return ''
  }

  const base64Decoded = decodeBase64Utf8(cleaned)
  if (base64Decoded) {
    return base64Decoded
  }

  try {
    return decodeURIComponent(cleaned)
  }
  catch (_error) {}

  return cleaned
}

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
      return decodePayload(this.source)
    },
    decodedDescription() {
      return decodePayload(this.description)
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
