<script lang="ts">
// @ts-nocheck
import Locale from '../../../../src/mixins/locale'
import { modifyWithTimeString } from '../../../../src/utils/date-util'
import Picker from '../picker.vue'
import {
  formatAsFormatAndType,
  parseAsFormatAndType,
  valueEquals,
} from '../utils/shared'
import BaseDatePicker from './base-date-picker'

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

  mixins: [Locale],

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
      activeField: null,
      highlightStyle: {
        opacity: 0,
      },
    }
  },

  computed: {
    containerClasses(): Array<string> {
      const classes: Array<string> = []

      if (this.pickerSize) {
        classes.push(`el-range-editor-v2--${this.pickerSize}`)
        classes.push(`el-date-range-editor-v2--${this.pickerSize}`)
      }

      if (this.type) {
        classes.push(`el-date-range-editor-v2--${this.type}`)
      }

      if (this.pickerDisabled) {
        classes.push('is-disabled')
      }

      if (this.activeField) {
        classes.push('is-active')
      }

      return classes
    },

    pickerDisabled(): boolean {
      return this.disabled || (this.elForm || {}).disabled
    },

    pickerSize(): string | undefined {
      const formItemSize = (this.elFormItem || {}).elFormItemSize
      const configSize = (this.$elementConfig || {}).size
      return this.size || formItemSize || configSize
    },

    singlePanelType(): 'date' | 'datetime' | 'month' | 'year' {
      if (this.type === 'datetimerange') {
        return 'datetime'
      }
      if (this.type === 'monthrange') {
        return 'month'
      }
      if (this.type === 'yearrange') {
        return 'year'
      }
      return 'date'
    },

    startPlaceholderText(): string {
      return this.startPlaceholder || this.placeholder || this.t('el.datepicker.startDate')
    },

    endPlaceholderText(): string {
      return this.endPlaceholder || this.placeholder || this.t('el.datepicker.endDate')
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
      handler(newVal, oldVal) {
        const [start, end] = this.normalizeRange(newVal)
        const [oldStart, oldEnd] = this.normalizeRange(oldVal)

        const startChanged = !valueEquals(start, this.startValue)
        const endChanged = !valueEquals(end, this.endValue)

        if (startChanged) {
          this.startValue = start
        }
        if (endChanged) {
          this.endValue = end
        }

        if (this.activeField) {
          this.$nextTick(() => {
            this.updateHighlight()
          })
        }

        if (this.activeField === 'start' && this.valueWasCleared(oldStart, start)) {
          this.handleFieldClear('start')
        }
        if (this.activeField === 'end' && this.valueWasCleared(oldEnd, end)) {
          this.handleFieldClear('end')
        }
      },
    },
    pickerDisabled(val: boolean) {
      if (val && this.activeField) {
        this.activeField = null
        this.$emit('blur', this)
      }
    },
    activeField() {
      this.$nextTick(() => {
        this.updateHighlight()
      })
    },
  },

  mounted() {
    this.updateHighlight()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize)
    }
  },

  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize)
    }
  },

  methods: {
    focus() {
      const picker: any = this.$refs.startPicker
      if (picker && typeof picker.focus === 'function') {
        picker.focus()
      }
    },

    open(role = 'start') {
      if (this.pickerDisabled) {
        return
      }
      if (role === 'end') {
        const picker: any = this.$refs.endPicker
        if (picker && typeof picker.open === 'function') {
          picker.open()
        }
        this.handleFieldFocus('end')
        return
      }
      const picker: any = this.$refs.startPicker
      if (picker && typeof picker.open === 'function') {
        picker.open()
      }
      this.handleFieldFocus('start')
    },

    close(role = 'start') {
      if (role === 'end') {
        this.closePanel('end')
        return
      }
      this.closePanel('start')
    },

    blur() {
      const pickerStart: any = this.$refs.startPicker
      const pickerEnd: any = this.$refs.endPicker
      if (!this.activeField) {
        return
      }

      if (this.activeField === 'start') {
        if (pickerStart && typeof pickerStart.blur === 'function') {
          pickerStart.blur()
        }
      }
      else if (this.activeField === 'end') {
        if (pickerEnd && typeof pickerEnd.blur === 'function') {
          pickerEnd.blur()
        }
      }

      this.activeField = null
    },

    handleResize() {
      if (!this.activeField) {
        return
      }
      this.updateHighlight()
    },

    normalizeRange(value: any): [any, any] {
      if (Array.isArray(value)) {
        const [start, end] = value
        return [start ?? null, end ?? null]
      }
      return [null, null]
    },

    handleStartInput(val: unknown) {
      const previous = this.startValue
      if (!valueEquals(val, this.startValue)) {
        this.startValue = val
      }
      if (this.endValue && this.compareValues(val, this.endValue) > 0) {
        this.endValue = null
      }
      if (this.valueWasCleared(previous, val)) {
        this.handleFieldClear('start')
      }
      this.emitModel()
    },

    handleEndInput(val: unknown) {
      const previous = this.endValue
      const hadStartValue = this.hasFieldValue(this.startValue)
      if (!valueEquals(val, this.endValue)) {
        this.endValue = val
      }
      const clearedEnd = this.valueWasCleared(previous, val)
      if (this.singleClear && clearedEnd && hadStartValue) {
        this.startValue = null
        if (this.activeField === 'start') {
          this.handleFieldClear('start')
        }
      }
      if (this.startValue && this.compareValues(this.startValue, val) > 0) {
        this.startValue = null
      }
      if (clearedEnd) {
        this.handleFieldClear('end')
        this.activeField = null
      }
      this.emitModel()
    },

    handleStartChange() {
      const rangeComplete = this.hasFieldValue(this.startValue) && this.hasFieldValue(this.endValue)
      const rangeCleared = !this.hasFieldValue(this.startValue) && !this.hasFieldValue(this.endValue)
      if (rangeComplete || rangeCleared) {
        this.emitModel('change')
      }
      if (this.coerceValueToDate(this.startValue)) {
        this.focusEndInput()
      }
    },

    handleEndChange() {
      const rangeComplete = this.hasFieldValue(this.startValue) && this.hasFieldValue(this.endValue)
      const rangeCleared = !this.hasFieldValue(this.startValue) && !this.hasFieldValue(this.endValue)
      if (rangeComplete || rangeCleared) {
        this.emitModel('change')
      }
    },

    handleStartFocus() {
      this.handleFieldFocus('start')
    },

    handleEndFocus() {
      this.handleFieldFocus('end')
    },

    handleStartBlur() {
      this.handleFieldBlur('start')
    },

    handleEndBlur() {
      this.handleFieldBlur('end')
    },

    handleFieldClear(role: 'start' | 'end') {
      if (this.activeField === role) {
        this.activeField = null
        const refName = role === 'start' ? 'startPicker' : 'endPicker'
        const picker: any = this.$refs[refName]
        if (picker && typeof picker.blur === 'function') {
          picker.blur()
        }
        else if (picker && picker.$el) {
          const input = picker.$el.querySelector('input')
          if (input && typeof input.blur === 'function') {
            input.blur()
          }
        }
      }
    },

    focusEndInput() {
      if (this.pickerDisabled) {
        return
      }
      this.$nextTick(() => {
        const endPicker: any = this.$refs.endPicker
        if (endPicker && typeof endPicker.focus === 'function') {
          endPicker.focus()
        }
        else {
          this.handleFieldFocus('end')
        }
      })
    },

    handleFieldFocus(role: 'start' | 'end') {
      if (this.pickerDisabled) {
        return
      }
      const wasInactive = !this.activeField
      this.activeField = role

      if (wasInactive) {
        this.$emit('focus', this)
      }
    },

    handleFieldBlur(role: 'start' | 'end') {
      setTimeout(() => {
        if (this.activeField === role) {
          this.activeField = null
          this.$emit('blur', this)
        }
        else if (!this.activeField) {
          this.$emit('blur', this)
        }
      }, 50)
    },

    valueWasCleared(previous: any, next: any): boolean {
      return this.hasFieldValue(previous) && !this.hasFieldValue(next)
    },

    hasFieldValue(value: any): boolean {
      if (value === null || value === undefined || value === '') {
        return false
      }
      return this.coerceValueToDate(value) instanceof Date
    },

    emitModel(trigger?: 'change') {
      const hasStart = this.hasFieldValue(this.startValue)
      const hasEnd = this.hasFieldValue(this.endValue)
      const applyDefaultTime = this.singlePanelType === 'date' && (this.startDefaultTime || this.endDefaultTime)
      const startValue = applyDefaultTime
        ? this.applyDefaultTimeToValue(this.startValue, 'start')
        : this.startValue
      const endValue = applyDefaultTime
        ? this.applyDefaultTimeToValue(this.endValue, 'end')
        : this.endValue
      const payload = hasStart || hasEnd ? [startValue ?? null, endValue ?? null] : null

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
      const comparisonDate = isStart
        ? this.coerceValueToDate(this.endValue)
        : this.coerceValueToDate(this.startValue)
      let defaultValue = isStart ? this.startDefaultValue : this.endDefaultValue

      if (!defaultValue && comparisonDate) {
        defaultValue = comparisonDate
      }

      return {
        type: this.singlePanelType,
        value: isStart ? this.startValue : this.endValue,
        size: this.size,
        format: this.format,
        valueFormat: this.valueFormat,
        readonly: this.readonly,
        prefixIcon: this.prefixIcon,
        clearIcon: this.clearIcon,
        disabled: this.disabled,
        clearable: this.singleClear ? (!isStart && this.clearable) : this.clearable,
        popperClass: isStart ? this.startPopperClass : this.endPopperClass,
        editable: this.editable,
        align: this.align,
        name: isStart ? this.startName : this.endName,
        id: isStart ? this.startId : this.endId,
        placeholder: isStart ? this.startPlaceholderText : this.endPlaceholderText,
        defaultValue,
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

      const compareUnit = (dateA: Date, dateB: Date) => {
        if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
          return 0
        }
        if (this.singlePanelType === 'datetime') {
          const normalizedA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate())
          const normalizedB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate())
          return normalizedA.getTime() - normalizedB.getTime()
        }
        return dateA.getTime() - dateB.getTime()
      }

      // For the start role, do NOT disable dates after endValue.
      // When the user picks a start date beyond the current end, handleStartInput
      // will automatically clear endValue, so the panel should not block the pick.
      const comparator = role === 'end'
        ? (date: Date) => comparisonDate && compareUnit(date, comparisonDate) < 0
        : null

      const optionDisabled = typeof disabledDate === 'function' ? disabledDate : null

      return {
        ...rest,
        shortcuts: this.buildShortcuts(_shortcuts, role),
        disabledDate: (date: Date) => {
          if (optionDisabled && optionDisabled(date)) {
            return true
          }
          if (comparator && comparator(date)) {
            return true
          }
          return false
        },
      }
    },

    buildShortcuts(shortcuts, role: 'start' | 'end') {
      if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
        return shortcuts
      }

      return shortcuts.map((shortcut) => {
        if (!shortcut || typeof shortcut !== 'object') {
          return shortcut
        }

        const { onClick } = shortcut

        if (typeof onClick !== 'function') {
          return shortcut
        }

        return {
          ...shortcut,
          onClick: (panel) => {
            let picked = false
            const originalEmit = panel.$emit

            panel.$emit = (event, payload, ...args) => {
              if (event === 'pick') {
                picked = true
                this.handleShortcutPick(payload, args, role)
                return
              }
              originalEmit.call(panel, event, payload, ...args)
            }

            try {
              const result = onClick(panel)
              if (!picked && result) {
                this.handleShortcutPick(result, [], role)
              }
            }
            finally {
              panel.$emit = originalEmit
            }
          },
        }
      })
    },

    handleShortcutPick(rangeValue, args, role: 'start' | 'end') {
      const range = this.normalizeShortcutRange(rangeValue)

      if (!range) {
        return
      }

      const [startDateRaw, endDateRaw] = range
      const startDate = this.applyShortcutTime(startDateRaw, this.startDefaultTime)
      const endDate = this.applyShortcutTime(endDateRaw, this.endDefaultTime)

      if (!startDate || !endDate) {
        return
      }

      const formattedStart = this.formatShortcutValue(startDate)
      const formattedEnd = this.formatShortcutValue(endDate)

      const startChanged = !valueEquals(formattedStart, this.startValue)
      const endChanged = !valueEquals(formattedEnd, this.endValue)

      if (startChanged) {
        this.startValue = formattedStart
      }
      if (endChanged) {
        this.endValue = formattedEnd
      }

      if (startChanged || endChanged) {
        this.emitModel('change')
      }

      const keepVisible = Array.isArray(args) && args.some(item => typeof item === 'boolean' && item === true)

      if (!keepVisible) {
        this.closePanel(role)
      }
    },

    normalizeShortcutRange(value) {
      if (Array.isArray(value)) {
        const [start, end] = value
        const startDate = this.coerceShortcutDate(start)
        const endDate = this.coerceShortcutDate(end)

        if (startDate && endDate) {
          return [startDate, endDate]
        }
        return null
      }

      if (value && typeof value === 'object') {
        const maybeStart = 'minDate' in value ? value.minDate : value.start
        const maybeEnd = 'maxDate' in value ? value.maxDate : value.end

        const startDate = this.coerceShortcutDate(maybeStart)
        const endDate = this.coerceShortcutDate(maybeEnd)

        if (startDate && endDate) {
          return [startDate, endDate]
        }
      }

      return null
    },

    coerceShortcutDate(value) {
      if (!value) {
        return null
      }

      if (value instanceof Date) {
        return new Date(value.getTime())
      }

      if (this.valueFormat && typeof value === 'string') {
        const parsed = parseAsFormatAndType(value, this.valueFormat, this.singlePanelType)
        if (parsed instanceof Date) {
          return parsed
        }
      }

      if (typeof value === 'number' || typeof value === 'string') {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
          return date
        }
      }

      return null
    },

    applyDefaultTimeToValue(value, role: 'start' | 'end') {
      const timeConfig = role === 'start' ? this.startDefaultTime : this.endDefaultTime
      const date = this.coerceValueToDate(value)

      if (!timeConfig || !date) {
        return value
      }

      const withTime = modifyWithTimeString(new Date(date.getTime()), timeConfig)

      if (value instanceof Date) {
        return withTime
      }

      if (this.valueFormat) {
        return formatAsFormatAndType(withTime, this.valueFormat, this.singlePanelType)
      }

      if (typeof value === 'number') {
        return withTime.getTime()
      }

      return withTime
    },

    applyShortcutTime(date, timeConfig) {
      if (!date) {
        return null
      }

      const cloned = new Date(date.getTime())

      if (!timeConfig || this.singlePanelType === 'month' || this.singlePanelType === 'year') {
        return cloned
      }

      if (typeof timeConfig === 'string') {
        return modifyWithTimeString(cloned, timeConfig)
      }

      if (timeConfig instanceof Date) {
        const pad = value => `${value}`.padStart(2, '0')
        return modifyWithTimeString(
          cloned,
          `${pad(timeConfig.getHours())}:${pad(timeConfig.getMinutes())}:${pad(timeConfig.getSeconds())}`,
        )
      }

      return cloned
    },

    formatShortcutValue(date) {
      if (!date) {
        return null
      }

      if (this.valueFormat) {
        return formatAsFormatAndType(date, this.valueFormat, this.singlePanelType)
      }

      return date
    },

    closePanel(role: 'start' | 'end') {
      const refName = role === 'start' ? 'startPicker' : 'endPicker'
      const picker: any = this.$refs[refName]

      if (picker && typeof picker.handleClose === 'function') {
        picker.handleClose()
      }
      else if (picker) {
        picker.pickerVisible = false
      }

      this.activeField = null
      this.updateHighlight()
    },

    composePopperClass(role: 'start' | 'end') {
      const roleClass = `el-date-range-picker-v2__panel--${role}`

      return [this.popperClass, roleClass].filter(Boolean).join(' ') || undefined
    },

    updateHighlight() {
      const wrapper = this.$refs.wrapper as HTMLElement
      if (!wrapper) {
        return
      }

      if (!this.activeField) {
        const previous = this.highlightStyle || {}
        this.highlightStyle = {
          ...previous,
          opacity: 0,
        }
        return
      }

      const wrapperRect = wrapper.getBoundingClientRect()
      const separator = this.$refs.separator as HTMLElement | undefined
      const separatorRect = separator ? separator.getBoundingClientRect() : null

      const gap = 10
      const separatorLeft = separatorRect ? separatorRect.left - wrapperRect.left : wrapperRect.width / 2
      const separatorRight = separatorRect ? separatorRect.right - wrapperRect.left : wrapperRect.width / 2

      const startAreaStart = gap
      const startAreaEnd = Math.max(separatorLeft - gap, startAreaStart)
      const endAreaEnd = wrapperRect.width - gap
      const endAreaStart = Math.min(separatorRight + gap, endAreaEnd)

      const startAreaWidth = Math.max(startAreaEnd - startAreaStart, 0)
      const endAreaWidth = Math.max(endAreaEnd - endAreaStart, 0)
      const targetWidth = Math.max(Math.min(startAreaWidth, endAreaWidth), 0)
      const inset = 2
      const activeCell
        = (this.activeField === 'start'
          ? (this.$refs.startCell as HTMLElement | undefined)
          : (this.$refs.endCell as HTMLElement | undefined))
      const activeRect = activeCell ? activeCell.getBoundingClientRect() : null

      if (activeRect) {
        const areaStart = this.activeField === 'start' ? startAreaStart : endAreaStart
        const areaEnd = this.activeField === 'start' ? startAreaEnd : endAreaEnd
        const desiredWidth = activeRect.width + inset * 2
        const desiredLeft = activeRect.left - wrapperRect.left - inset
        const maxWidth = Math.max(areaEnd - areaStart, 0)
        const width = Math.max(Math.min(desiredWidth, maxWidth), 0)
        const center = desiredLeft + desiredWidth / 2
        const left = Math.min(Math.max(center - width / 2, areaStart), areaEnd - width)

        this.highlightStyle = {
          opacity: 1,
          left: `${left}px`,
          width: `${width}px`,
        }
        return
      }

      if (this.activeField === 'start') {
        const offset = (startAreaWidth - targetWidth) / 2
        const left = Math.max(startAreaStart + offset - inset, 0)
        const width = Math.max(Math.min(targetWidth + inset * 2, wrapperRect.width - left), 0)
        this.highlightStyle = {
          opacity: 1,
          left: `${left}px`,
          width: `${width}px`,
        }
      }
      else {
        const offset = (endAreaWidth - targetWidth) / 2
        const left = Math.max(endAreaStart + offset - inset, 0)
        const width = Math.max(Math.min(targetWidth + inset * 2, wrapperRect.width - left), 0)
        this.highlightStyle = {
          opacity: 1,
          left: `${left}px`,
          width: `${width}px`,
        }
      }
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
        return parseAsFormatAndType(value, this.valueFormat, this.singlePanelType) as Date
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
    ref="wrapper"
    class="el-date-editor-v2 el-range-editor-v2 el-date-range-editor-v2 el-date-range-editor-v2--split el-input__inner"
    :class="containerClasses"
  >
    <div
      class="el-date-range-editor-v2__highlight"
      :style="highlightStyle"
      aria-hidden="true"
    />
    <div
      ref="startCell"
      class="el-date-range-editor-v2__cell"
      :class="{ 'is-active': activeField === 'start' }"
    >
      <BaseDatePicker
        ref="startPicker"
        v-bind="startPickerProps"
        @input="handleStartInput"
        @change="handleStartChange"
        @focus="handleStartFocus"
        @blur="handleStartBlur"
      />
    </div>
    <slot name="range-separator">
      <span
        ref="separator"
        class="el-range-separator-v2 el-date-range-editor-v2__separator"
      >{{ rangeSeparator }}</span>
    </slot>
    <div
      ref="endCell"
      class="el-date-range-editor-v2__cell"
      :class="{ 'is-active': activeField === 'end' }"
    >
      <BaseDatePicker
        ref="endPicker"
        v-bind="endPickerProps"
        @input="handleEndInput"
        @change="handleEndChange"
        @focus="handleEndFocus"
        @blur="handleEndBlur"
      />
    </div>
  </div>
</template>
