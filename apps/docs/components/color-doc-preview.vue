<script>
import bus from '../bus'
import { tintColor } from '../color.ts'
import { ACTION_USER_CONFIG_UPDATE } from './theme/constant'

const VAR_MAP = {
  primary: '$--color-primary',
  success: '$--color-success',
  warning: '$--color-warning',
  danger: '$--color-danger',
  info: '$--color-info',
  white: '$--color-white',
  black: '$--color-black',
  textPrimary: '$--color-text-primary',
  textRegular: '$--color-text-regular',
  textSecondary: '$--color-text-secondary',
  textPlaceholder: '$--color-text-placeholder',
  borderBase: '$--border-color-base',
  borderLight: '$--border-color-light',
  borderLighter: '$--border-color-lighter',
  borderExtraLight: '$--border-color-extra-light',
}

const ORIGINAL_VALUES = {
  primary: '#409EFF',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  white: '#FFFFFF',
  black: '#000000',
  textPrimary: '#303133',
  textRegular: '#606266',
  textSecondary: '#909399',
  textPlaceholder: '#C0C4CC',
  borderBase: '#DCDFE6',
  borderLight: '#E4E7ED',
  borderLighter: '#EBEEF5',
  borderExtraLight: '#F2F6FC',
}

export default {
  name: 'ColorDocPreview',
  props: {
    variant: {
      type: String,
      default: 'main',
      validator(value) {
        return ['main', 'scene', 'neutral'].includes(value)
      },
    },
  },
  data() {
    return {
      global: {},
      primary: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
      white: '',
      black: '',
      textPrimary: '',
      textRegular: '',
      textSecondary: '',
      textPlaceholder: '',
      borderBase: '',
      borderLight: '',
      borderLighter: '',
      borderExtraLight: '',
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
    tintColor(color, tint) {
      return tintColor(color, tint)
    },
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
        const cssVar = VAR_MAP[key]
        const override = cssVar ? overrides[cssVar] : undefined
        this[key] = override || ORIGINAL_VALUES[key]
      })
    },
  },
}
</script>

<template>
  <div class="color-doc-preview">
    <el-row v-if="variant === 'main'" :gutter="12">
      <el-col :span="10" :xs="{ span: 12 }">
        <div class="demo-color-box" :style="{ background: primary }">
          <slot name="title">Brand Color</slot>
          <div class="value">
            {{ primary }}
          </div>
          <div class="bg-color-sub" :style="{ background: tintColor(primary, 0.9) }">
            <div
              v-for="(item, key) in Array(8)"
              :key="key"
              class="bg-blue-sub-item"
              :style="{ background: tintColor(primary, (key + 1) / 10) }"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-else-if="variant === 'scene'" :gutter="12">
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box" :style="{ background: success }">
          <slot name="success">Success</slot>
          <div class="value">
            {{ success }}
          </div>
          <div class="bg-color-sub">
            <div
              v-for="(item, key) in Array(2)"
              :key="key"
              class="bg-success-sub-item"
              :style="{ background: tintColor(success, (key + 8) / 10) }"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box" :style="{ background: warning }">
          <slot name="warning">Warning</slot>
          <div class="value">
            {{ warning }}
          </div>
          <div class="bg-color-sub">
            <div
              v-for="(item, key) in Array(2)"
              :key="key"
              class="bg-success-sub-item"
              :style="{ background: tintColor(warning, (key + 8) / 10) }"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box" :style="{ background: danger }">
          <slot name="danger">Danger</slot>
          <div class="value">
            {{ danger }}
          </div>
          <div class="bg-color-sub">
            <div
              v-for="(item, key) in Array(2)"
              :key="key"
              class="bg-success-sub-item"
              :style="{ background: tintColor(danger, (key + 8) / 10) }"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box" :style="{ background: info }">
          <slot name="info">Info</slot>
          <div class="value">
            {{ info }}
          </div>
          <div class="bg-color-sub">
            <div
              v-for="(item, key) in Array(2)"
              :key="key"
              class="bg-success-sub-item"
              :style="{ background: tintColor(info, (key + 8) / 10) }"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-else :gutter="12">
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box-group">
          <div class="demo-color-box demo-color-box-other" :style="{ background: textPrimary }">
            <slot name="text-primary">Primary Text</slot>
            <div class="value">
              {{ textPrimary }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other" :style="{ background: textRegular }">
            <slot name="text-regular">Regular Text</slot>
            <div class="value">
              {{ textRegular }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other" :style="{ background: textSecondary }">
            <slot name="text-secondary">Secondary Text</slot>
            <div class="value">
              {{ textSecondary }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other" :style="{ background: textPlaceholder }">
            <slot name="text-placeholder">Placeholder Text</slot>
            <div class="value">
              {{ textPlaceholder }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box-group">
          <div class="demo-color-box demo-color-box-other demo-color-box-lite" :style="{ background: borderBase }">
            <slot name="border-base">Base Border</slot>
            <div class="value">
              {{ borderBase }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other demo-color-box-lite" :style="{ background: borderLight }">
            <slot name="border-light">Light Border</slot>
            <div class="value">
              {{ borderLight }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other demo-color-box-lite" :style="{ background: borderLighter }">
            <slot name="border-lighter">Lighter Border</slot>
            <div class="value">
              {{ borderLighter }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other demo-color-box-lite" :style="{ background: borderExtraLight }">
            <slot name="border-extra-light">Extra Light Border</slot>
            <div class="value">
              {{ borderExtraLight }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :xs="{ span: 12 }">
        <div class="demo-color-box-group">
          <div class="demo-color-box demo-color-box-other" :style="{ background: black }">
            <slot name="black">Basic Black</slot>
            <div class="value">
              {{ black }}
            </div>
          </div>
          <div
            class="demo-color-box demo-color-box-other"
            :style="{ background: white, color: '#303133', border: '1px solid #eee' }"
          >
            <slot name="white">Basic White</slot>
            <div class="value">
              {{ white }}
            </div>
          </div>
          <div class="demo-color-box demo-color-box-other bg-transparent">
            <slot name="transparent">Transparent</slot>
            <div class="value">
              Transparent
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
