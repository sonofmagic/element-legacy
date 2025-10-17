<script lang="ts">
// @ts-nocheck
import Picker from '../picker.vue'
import {
  parseAsFormatAndType,
  valueEquals,
} from '../utils/shared'
import BaseDatePicker from './base-date-picker'

const SINGLE_PANEL_TYPE = 'date'

function arrayItem<T>(value: T | T[] | undefined, index: number): T | undefined {
  if (Array.isArray(value)) {
    return value[index]
  }
  return value as T
}

export default {
  name: 'ElDatePickerV2RangeSplit',

  components: {
    BaseDatePicker,
  },

  inject: {
    elForm: {
      default: '',
    },
    elFormItem: {
      default: '',
    },
  },

  inheritAttrs: false,

  props: {
    ...Picker.props,
    type: {
      type: String,
      default: 'daterange',
    },
    timeArrowControl: Boolean,
  },

  data() {
    const [start, end] = this.normalizeRange(this.value)

    return {
      startValue: start,
      endValue: end,
    }
  },

  computed: {
    pickerDisabled(): boolean {
      return this.disabled || (this.elForm || {}).disabled
    },

    pickerSize(): string | undefined {
      const formItemSize = (this.elFormItem || {}).elFormItemSize
      return this.size || formItemSize || (this.$ELEMENT || {}).size
    },

    startPlaceholderText(): string {
      return this.startPlaceholder || this.placeholder || ''
    },

    endPlaceholderText(): string {
      return this.endPlaceholder || this.placeholder || ''
    },

    startName(): string | undefined {
      return arrayItem(this.name, 0)
    },

    endName(): string | undefined {
      return arrayItem(this.name, 1)
    },

    startId(): string | undefined {
      return arrayItem(this.id, 0)
    },

    endId(): string | undefined {
      return arrayItem(this.id, 1)
    },

    startDefaultValue(): unknown {
      return arrayItem(this.defaultValue, 0)
    },

    endDefaultValue(): unknown {
      return arrayItem(this.defaultValue, 1)
    },

    startDefaultTime(): unknown {
      return arrayItem(this.defaultTime, 0)
    },

    endDefaultTime(): unknown {
      return arrayItem(this.defaultTime, 1)
    },

    startPickerOptions(): Record<string, unknown> {
      return this.buildPickerOptions('start')
    },

    endPickerOptions(): Record<string, unknown> {
      return this.buildPickerOptions('end')
    },

    startPopperClass(): string | undefined {
      return this.composePopperClass('start')
    },

    endPopperClass(): string | undefined {
      return this.composePopperClass('end')
    },

    startPickerProps(): Record<string, unknown> {
      return this.buildPickerProps('start')
    },

    endPickerProps(): Record<string, unknown> {
      return this.buildPickerProps('end')
    },
  },

  watch: {
    value: {
      deep: true,
      handler(newVal) {
        const [start, end] = this.normalizeRange(newVal)
        if (!valueEquals(start, this.startValue)) {
          this.startValue = start
        }
        if (!valueEquals(end, this.endValue)) {
          this.endValue = end
        }
      },
    },
  },

  methods: {
    focus() {
      const picker: any = this.$refs.startPicker
      if (picker && typeof picker.focus === 'function') {
        picker.focus()
      }
    },

    blur() {
      const pickerStart: any = this.$refs.startPicker
      const pickerEnd: any = this.$refs.endPicker
      if (pickerStart && typeof pickerStart.blur === 'function') {
        pickerStart.blur()
      }
      if (pickerEnd && typeof pickerEnd.blur === 'function') {
        pickerEnd.blur()
      }
    },

    normalizeRange(value: any): [any, any] {
      if (Array.isArray(value)) {
        const [start, end] = value
        return [start ?? null, end ?? null]
      }
      return [null, null]
    },

    handleStartInput(val: unknown) {
      if (!valueEquals(val, this.startValue)) {
        this.startValue = val
      }
      if (this.endValue && this.compareValues(val, this.endValue) > 0) {
        this.endValue = null
      }
      this.emitModel()
    },

    handleEndInput(val: unknown) {
      if (!valueEquals(val, this.endValue)) {
        this.endValue = val
      }
      if (this.startValue && this.compareValues(this.startValue, val) > 0) {
        this.startValue = null
      }
      this.emitModel()
    },

    handleStartChange() {
      this.emitModel('change')
    },

    handleEndChange() {
      this.emitModel('change')
    },

    handleFieldFocus() {
      this.$emit('focus', this)
    },

    handleFieldBlur() {
      this.$emit('blur', this)
    },

    emitModel(trigger?: 'change') {
      const payload = [this.startValue ?? null, this.endValue ?? null]

      this.$emit('input', payload)

      if (trigger === 'change') {
        this.$emit('change', payload)

        const { pickerOptions } = this
        if (pickerOptions && typeof pickerOptions.onPick === 'function') {
          const minDate = this.coerceValueToDate(this.startValue)
          const maxDate = this.coerceValueToDate(this.endValue)

          if (minDate && maxDate) {
            pickerOptions.onPick({
              minDate,
              maxDate,
            })
          }
        }
      }
    },

    buildPickerProps(role: 'start' | 'end') {
      const isStart = role === 'start'

      return {
        type: SINGLE_PANEL_TYPE,
        value: isStart ? this.startValue : this.endValue,
        size: this.size,
        format: this.format,
        valueFormat: this.valueFormat,
        readonly: this.readonly,
        prefixIcon: this.prefixIcon,
        clearIcon: this.clearIcon,
        disabled: this.disabled,
        clearable: this.clearable,
        popperClass: isStart ? this.startPopperClass : this.endPopperClass,
        editable: this.editable,
        align: this.align,
        name: isStart ? this.startName : this.endName,
        id: isStart ? this.startId : this.endId,
        placeholder: isStart ? this.startPlaceholderText : this.endPlaceholderText,
        defaultValue: isStart ? this.startDefaultValue : this.endDefaultValue,
        defaultTime: isStart ? this.startDefaultTime : this.endDefaultTime,
        pickerOptions: isStart ? this.startPickerOptions : this.endPickerOptions,
        validateEvent: this.validateEvent,
        timeArrowControl: this.timeArrowControl,
      }
    },

    buildPickerOptions(role: 'start' | 'end') {
      const raw = this.pickerOptions || {}
      const {
        shortcuts: _shortcuts,
        onPick: _onPick,
        disabledDate,
        ...rest
      } = raw

      const comparisonDate = role === 'start'
        ? this.coerceValueToDate(this.endValue)
        : this.coerceValueToDate(this.startValue)

      const comparator = role === 'start'
        ? (date: Date) => comparisonDate && date.getTime() > comparisonDate.getTime()
        : (date: Date) => comparisonDate && date.getTime() < comparisonDate.getTime()

      const optionDisabled = typeof disabledDate === 'function' ? disabledDate : null

      return {
        ...rest,
        disabledDate: (date: Date) => {
          if (optionDisabled && optionDisabled(date)) {
            return true
          }
          if (comparator(date)) {
            return true
          }
          return false
        },
      }
    },

    composePopperClass(role: 'start' | 'end') {
      const roleClass = `el-date-range-picker-v2__panel--${role}`

      return [this.popperClass, roleClass].filter(Boolean).join(' ') || undefined
    },

    compareValues(left: any, right: any): number {
      const leftDate = this.coerceValueToDate(left)
      const rightDate = this.coerceValueToDate(right)

      if (!leftDate || !rightDate) {
        return 0
      }

      const diff = leftDate.getTime() - rightDate.getTime()

      if (diff === 0) {
        return 0
      }

      return diff > 0 ? 1 : -1
    },

    coerceValueToDate(value: any): Date | null {
      if (!value) {
        return null
      }
      if (value instanceof Date) {
        return value
      }

      if (this.valueFormat) {
        return parseAsFormatAndType(value, this.valueFormat, SINGLE_PANEL_TYPE) as Date
      }

      if (typeof value === 'number' || typeof value === 'string') {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? null : date
      }

      return null
    },
  },
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="el-date-range-editor-v2 el-date-range-editor-v2--split"
    :class="[
      pickerSize ? `el-date-range-editor-v2--${pickerSize}` : '',
      pickerDisabled ? 'is-disabled' : '',
    ]"
  >
    <BaseDatePicker
      ref="startPicker"
      v-bind="startPickerProps"
      @input="handleStartInput"
      @change="handleStartChange"
      @focus="handleFieldFocus"
      @blur="handleFieldBlur"
    />
    <slot name="range-separator">
      <span class="el-range-separator-v2">{{ rangeSeparator }}</span>
    </slot>
    <BaseDatePicker
      ref="endPicker"
      v-bind="endPickerProps"
      @input="handleEndInput"
      @change="handleEndChange"
      @focus="handleFieldFocus"
      @blur="handleFieldBlur"
    />
  </div>
</template>
