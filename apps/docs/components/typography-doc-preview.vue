<script>
import bus from '../bus'
import { ACTION_USER_CONFIG_UPDATE } from './theme/constant'

const VAR_LIST = [
  { css: '$--font-size-extra-large', key: 'font_size_extra_large' },
  { css: '$--font-size-large', key: 'font_size_large' },
  { css: '$--font-size-medium', key: 'font_size_medium' },
  { css: '$--font-size-base', key: 'font_size_base' },
  { css: '$--font-size-small', key: 'font_size_small' },
  { css: '$--font-size-extra-small', key: 'font_size_extra_small' },
]

const ORIGINAL_FONT_SIZES = {
  font_size_extra_large: '20px',
  font_size_large: '18px',
  font_size_medium: '16px',
  font_size_base: '14px',
  font_size_small: '13px',
  font_size_extra_small: '12px',
}

export default {
  name: 'TypographyDocPreview',
  props: {
    headerLevel: {
      type: String,
      default: 'Level',
    },
    headerFontSize: {
      type: String,
      default: 'Font Size',
    },
    headerDemo: {
      type: String,
      default: 'Demo',
    },
    extraSmallLabel: {
      type: String,
      default: 'Supplementary text',
    },
    smallLabel: {
      type: String,
      default: 'Body (small)',
    },
    baseLabel: {
      type: String,
      default: 'Body',
    },
    mediumLabel: {
      type: String,
      default: 'Small Title',
    },
    largeLabel: {
      type: String,
      default: 'Title',
    },
    extraLargeLabel: {
      type: String,
      default: 'Main Title',
    },
    exampleText: {
      type: String,
      default: 'Build with Element',
    },
  },
  data() {
    return {
      global: {},
      font_size_extra_large: '',
      font_size_large: '',
      font_size_medium: '',
      font_size_base: '',
      font_size_small: '',
      font_size_extra_small: '',
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
      for (const { css, key } of VAR_LIST) {
        this[key] = overrides[css] || ORIGINAL_FONT_SIZES[key]
      }
    },
  },
}
</script>

<template>
  <table class="demo-typo-size">
    <tbody>
      <tr>
        <td>{{ headerLevel }}</td>
        <td>{{ headerFontSize }}</td>
        <td class="color-dark-light">
          {{ headerDemo }}
        </td>
      </tr>
      <tr :style="{ fontSize: font_size_extra_small }">
        <td>{{ extraSmallLabel }}</td>
        <td class="color-dark-light">
          {{ font_size_extra_small }} Extra Small
        </td>
        <td>{{ exampleText }}</td>
      </tr>
      <tr :style="{ fontSize: font_size_small }">
        <td>{{ smallLabel }}</td>
        <td class="color-dark-light">
          {{ font_size_small }} Small
        </td>
        <td>{{ exampleText }}</td>
      </tr>
      <tr :style="{ fontSize: font_size_base }">
        <td>{{ baseLabel }}</td>
        <td class="color-dark-light">
          {{ font_size_base }} Base
        </td>
        <td>{{ exampleText }}</td>
      </tr>
      <tr :style="{ fontSize: font_size_medium }">
        <td>{{ mediumLabel }}</td>
        <td class="color-dark-light">
          {{ font_size_medium }} Medium
        </td>
        <td>{{ exampleText }}</td>
      </tr>
      <tr :style="{ fontSize: font_size_large }">
        <td>{{ largeLabel }}</td>
        <td class="color-dark-light">
          {{ font_size_large }} large
        </td>
        <td>{{ exampleText }}</td>
      </tr>
      <tr :style="{ fontSize: font_size_extra_large }">
        <td>{{ extraLargeLabel }}</td>
        <td class="color-dark-light">
          {{ font_size_extra_large }} Extra large
        </td>
        <td>{{ exampleText }}</td>
      </tr>
    </tbody>
  </table>
</template>
