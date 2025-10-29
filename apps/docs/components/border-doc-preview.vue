<script>
import bus from '../bus'
import { ACTION_USER_CONFIG_UPDATE } from './theme/constant'

const VAR_MAP = {
  '$--box-shadow-light': 'boxShadowLight',
  '$--box-shadow-base': 'boxShadowBase',
  '$--border-radius-base': 'borderRadiusBase',
  '$--border-radius-small': 'borderRadiusSmall',
}

const KEY_TO_VAR = Object.entries(VAR_MAP).reduce((acc, [cssVar, key]) => {
  acc[key] = cssVar
  return acc
}, {})

const ORIGINAL_VALUES = {
  boxShadowLight: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
  boxShadowBase: '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)',
  borderRadiusBase: '4px',
  borderRadiusSmall: '2px',
}

export default {
  name: 'BorderDocPreview',
  props: {
    variant: {
      type: String,
      default: 'radius',
      validator(value) {
        return ['radius', 'shadow'].includes(value)
      },
    },
    radiusNoneLabel: {
      type: String,
      default: 'No Radius',
    },
    radiusSmallLabel: {
      type: String,
      default: 'Small Radius',
    },
    radiusLargeLabel: {
      type: String,
      default: 'Large Radius',
    },
    radiusRoundLabel: {
      type: String,
      default: 'Round Radius',
    },
    shadowBaseLabel: {
      type: String,
      default: 'Basic Shadow',
    },
    shadowLightLabel: {
      type: String,
      default: 'Light Shadow',
    },
  },
  data() {
    return {
      global: {},
      boxShadowLight: '',
      boxShadowBase: '',
      borderRadiusBase: '',
      borderRadiusSmall: '',
    }
  },
  watch: {
    global: {
      immediate: true,
      handler(value) {
        this.applyTheme(value)
      },
    },
  },
  created() {
    bus.$on(ACTION_USER_CONFIG_UPDATE, this.setGlobal)
  },
  mounted() {
    this.setGlobal()
  },
  beforeDestroy() {
    bus.$off(ACTION_USER_CONFIG_UPDATE, this.setGlobal)
  },
  methods: {
    setGlobal() {
      if (window.userThemeConfig) {
        this.global = window.userThemeConfig.global
      }
      else {
        this.global = {}
      }
    },
    applyTheme(value) {
      const overrides = value || {}
      Object.keys(ORIGINAL_VALUES).forEach((key) => {
        const variable = KEY_TO_VAR[key]
        if (variable && overrides[variable]) {
          this[key] = overrides[variable]
        }
        else {
          this[key] = ORIGINAL_VALUES[key]
        }
      })
    },
  },
}
</script>

<template>
  <div class="border-doc-preview">
    <el-row v-if="variant === 'radius'" :gutter="12" class="demo-radius">
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="title">
          {{ radiusNoneLabel }}
        </div>
        <div class="value">
          border-radius: 0px
        </div>
        <div class="radius" />
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="title">
          {{ radiusSmallLabel }}
        </div>
        <div class="value">
          border-radius: {{ borderRadiusSmall }}
        </div>
        <div class="radius" :style="{ borderRadius: borderRadiusSmall }" />
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="title">
          {{ radiusLargeLabel }}
        </div>
        <div class="value">
          border-radius: {{ borderRadiusBase }}
        </div>
        <div class="radius" :style="{ borderRadius: borderRadiusBase }" />
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="title">
          {{ radiusRoundLabel }}
        </div>
        <div class="value">
          border-radius: 30px
        </div>
        <div class="radius radius-30" />
      </el-col>
    </el-row>
    <template v-else>
      <div class="demo-shadow" :style="{ boxShadow: boxShadowBase }" />
      <span class="demo-shadow-text">
        {{ shadowBaseLabel }} box-shadow: {{ boxShadowBase }}
      </span>

      <div class="demo-shadow" :style="{ boxShadow: boxShadowLight }" />
      <span class="demo-shadow-text">
        {{ shadowLightLabel }} box-shadow: {{ boxShadowLight }}
      </span>
    </template>
  </div>
</template>
