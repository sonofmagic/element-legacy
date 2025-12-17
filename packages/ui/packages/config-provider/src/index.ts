// @ts-nocheck
import { CONFIG_PROVIDER_INJECTION_KEY, getGlobalConfig, mergeConfig, setGlobalConfig } from 'element-legacy/src/utils/config-provider'

const ConfigProvider = {
  name: 'ElConfigProvider',

  props: {
    tag: {
      type: String,
      default: 'div',
    },
    size: String,
    zIndex: Number,
    namespace: String,
    button: Object,
    message: Object,
  },

  inject: {
    parentConfig: {
      from: CONFIG_PROVIDER_INJECTION_KEY,
      default: null,
    },
  },

  data() {
    return {
      config: mergeConfig(this.parentConfig || getGlobalConfig(), this.getConfigFromProps()),
      originalGlobalConfig: mergeConfig(getGlobalConfig()),
    }
  },

  provide() {
    return {
      [CONFIG_PROVIDER_INJECTION_KEY]: this.config,
    }
  },

  watch: {
    parentConfig: {
      deep: true,
      handler() {
        this.refreshConfig()
      },
    },
    size() {
      this.refreshConfig()
    },
    zIndex() {
      this.refreshConfig()
    },
    namespace() {
      this.refreshConfig()
    },
    button: {
      deep: true,
      handler() {
        this.refreshConfig()
      },
    },
    message: {
      deep: true,
      handler() {
        this.refreshConfig()
      },
    },
  },

  created() {
    if (!this.parentConfig) {
      setGlobalConfig(this.config)
    }
  },

  beforeDestroy() {
    if (!this.parentConfig) {
      setGlobalConfig(this.originalGlobalConfig)
    }
  },

  methods: {
    getConfigFromProps() {
      const config: Record<string, unknown> = {}

      if (this.size !== undefined) {
        config.size = this.size
      }

      if (this.zIndex !== undefined) {
        config.zIndex = this.zIndex
      }

      if (this.namespace !== undefined) {
        config.namespace = this.namespace
      }

      if (this.button !== undefined) {
        config.button = this.button
      }

      if (this.message !== undefined) {
        config.message = this.message
      }

      return config
    },

    refreshConfig() {
      const next = mergeConfig(this.parentConfig || getGlobalConfig(), this.getConfigFromProps())

      this.config.size = next.size
      this.config.zIndex = next.zIndex
      this.config.namespace = next.namespace
      this.config.button = { ...(next.button || {}) }
      this.config.message = { ...(next.message || {}) }

      if (!this.parentConfig) {
        setGlobalConfig(next)
      }
    },
  },

  render(h) {
    return h(this.tag, { class: 'el-config-provider' }, this.$slots.default)
  },
}

export default ConfigProvider
