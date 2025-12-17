<script>
import { useGlobalConfig } from 'element-legacy/src/utils/config-provider'
import { computed, inject, useSlots } from 'vue'

const CHINESE_TWO_CHAR_REG = /^[\u4E00-\u9FA5]{2}$/

export default {
  name: 'ElButton',

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

  setup(props, { emit }) {
    const elForm = inject('elForm', undefined)
    const elFormItem = inject('elFormItem', undefined)
    const slots = useSlots()
    const config = useGlobalConfig()

    const buttonConfig = computed(() => (config.value.button || {}))
    const _elFormItemSize = computed(() => (elFormItem || {}).elFormItemSize)
    const buttonSize = computed(() => props.size || _elFormItemSize.value || config.value.size)
    const buttonDisabled = computed(() => {
      const hasDisabledProp = Object.prototype.hasOwnProperty.call(props, 'disabled')
      return hasDisabledProp ? props.disabled : (elForm || {}).disabled
    })
    const autoInsertSpaceValue = computed(() => {
      if (props.autoInsertSpace === true || props.autoInsertSpace === false) {
        return props.autoInsertSpace
      }
      return Boolean(buttonConfig.value.autoInsertSpace)
    })
    const hasTwoChineseCharacters = computed(() => {
      const defaultSlot = slots.default ? slots.default() : undefined
      if (!defaultSlot || defaultSlot.length !== 1) {
        return false
      }

      const slot = defaultSlot[0]
      const text = (slot.text || '').trim()
      return text.length === 2 && CHINESE_TWO_CHAR_REG.test(text)
    })
    const shouldAddSpace = computed(() => autoInsertSpaceValue.value && hasTwoChineseCharacters.value)
    const spacedText = computed(() => {
      if (!shouldAddSpace.value) {
        return ''
      }

      const text = (slots.default?.()[0]?.text || '').trim()
      return text.split('').join(' ')
    })

    function handleClick(evt) {
      // Prevent click handler when button is logically disabled or loading.
      if (buttonDisabled.value || props.loading) {
        return
      }
      emit('click', evt)
    }

    return {
      buttonSize,
      buttonDisabled,
      shouldAddSpace,
      spacedText,
      handleClick,
    }
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
