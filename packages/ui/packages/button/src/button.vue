<script>
export default {
  name: 'ElButton',

  inject: {
    elForm: {
      default: '',
    },
    elFormItem: {
      default: '',
    },
  },

  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: String,
    icon: {
      type: String,
      default: '',
    },
    nativeType: {
      type: String,
      default: 'button',
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    autoInsertSpace: {
      type: Boolean,
      default: undefined,
    },
  },

  computed: {
    buttonConfig() {
      return (this.$ELEMENT || {}).button || {}
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    buttonDisabled() {
      const hasDisabledProp = Object.prototype.hasOwnProperty.call(this.$options.propsData, 'disabled')
      return hasDisabledProp ? this.disabled : (this.elForm || {}).disabled
    },
    autoInsertSpaceValue() {
      if (this.autoInsertSpace === true || this.autoInsertSpace === false) {
        return this.autoInsertSpace
      }
      return Boolean(this.buttonConfig.autoInsertSpace)
    },
    hasTwoChineseCharacters() {
      const defaultSlot = this.$slots.default
      if (!defaultSlot || defaultSlot.length !== 1) {
        return false
      }

      const slot = defaultSlot[0]
      const text = (slot.text || '').trim()
      return text.length === 2 && /^[\u4E00-\u9FA5]{2}$/.test(text)
    },
    shouldAddSpace() {
      return this.autoInsertSpaceValue && this.hasTwoChineseCharacters
    },
    spacedText() {
      if (!this.shouldAddSpace) {
        return ''
      }
      const text = (this.$slots.default?.[0]?.text || '').trim()
      return text.split('').join(' ')
    },
  },

  methods: {
    handleClick(evt) {
      // Prevent click handler when button is logically disabled or loading.
      if (this.buttonDisabled || this.loading) {
        return
      }
      this.$emit('click', evt)
    },
  },
}
</script>

<template>
  <button
    class="el-button"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? `el-button--${type}` : '',
      buttonSize ? `el-button--${buttonSize}` : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
      },
    ]"
    @click="handleClick"
  >
    <i v-if="loading" class="el-icon-loading" />
    <i v-if="icon && !loading" :class="icon" />
    <span v-if="$slots.default">
      <template v-if="shouldAddSpace">{{ spacedText }}</template>
      <slot v-else />
    </span>
  </button>
</template>
