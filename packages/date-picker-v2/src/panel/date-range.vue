<script lang="ts">
// @ts-nocheck
import ElButton from 'element-ui/packages/button'
import ElInput from 'element-ui/packages/input'
import Locale from 'element-ui/src/mixins/locale'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import {
  extractDateFormat,
  extractTimeFormat,
  formatDate,
  isDate,
  modifyDate,
  modifyTime,
  modifyWithTimeString,
  nextDate,
  nextMonth,
  nextYear,
  parseDate,
  prevMonth,
  prevYear,
} from 'element-ui/src/utils/date-util'
import DateTable from '../basic/date-table.vue'
import TimePicker from './time.vue'

function calcDefaultValue(defaultValue) {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])]
  }
  else if (defaultValue) {
    return [new Date(defaultValue), nextDate(new Date(defaultValue), 1)]
  }
  else {
    return [new Date(), nextDate(new Date(), 1)]
  }
}

export default {

  directives: { Clickoutside },

  components: { TimePicker, DateTable, ElInput, ElButton },
  mixins: [Locale],

  data() {
    return {
      popperClass: '',
      value: [],
      defaultValue: null,
      defaultTime: null,
      minDate: '',
      maxDate: '',
      leftDate: new Date(),
      rightDate: nextMonth(new Date()),
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null,
      },
      showTime: false,
      shortcuts: '',
      visible: '',
      disabledDate: '',
      cellClassName: '',
      firstDayOfWeek: 7,
      minTimePickerVisible: false,
      maxTimePickerVisible: false,
      format: '',
      arrowControl: false,
      unlinkPanels: false,
      dateUserInput: {
        min: null,
        max: null,
      },
      timeUserInput: {
        min: null,
        max: null,
      },
    }
  },

  computed: {
    btnDisabled() {
      return !(this.minDate && this.maxDate && !this.selecting && this.isValidValue([this.minDate, this.maxDate]))
    },

    leftLabel() {
      return `${this.leftDate.getFullYear()} ${this.t('el.datepicker.year')} ${this.t(`el.datepicker.month${this.leftDate.getMonth() + 1}`)}`
    },

    rightLabel() {
      return `${this.rightDate.getFullYear()} ${this.t('el.datepicker.year')} ${this.t(`el.datepicker.month${this.rightDate.getMonth() + 1}`)}`
    },

    leftYear() {
      return this.leftDate.getFullYear()
    },

    leftMonth() {
      return this.leftDate.getMonth()
    },

    leftMonthDate() {
      return this.leftDate.getDate()
    },

    rightYear() {
      return this.rightDate.getFullYear()
    },

    rightMonth() {
      return this.rightDate.getMonth()
    },

    rightMonthDate() {
      return this.rightDate.getDate()
    },

    minVisibleDate() {
      if (this.dateUserInput.min !== null) {
        return this.dateUserInput.min
      }
      if (this.minDate) {
        return formatDate(this.minDate, this.dateFormat)
      }
      return ''
    },

    maxVisibleDate() {
      if (this.dateUserInput.max !== null) {
        return this.dateUserInput.max
      }
      if (this.maxDate || this.minDate) {
        return formatDate(this.maxDate || this.minDate, this.dateFormat)
      }
      return ''
    },

    minVisibleTime() {
      if (this.timeUserInput.min !== null) {
        return this.timeUserInput.min
      }
      if (this.minDate) {
        return formatDate(this.minDate, this.timeFormat)
      }
      return ''
    },

    maxVisibleTime() {
      if (this.timeUserInput.max !== null) {
        return this.timeUserInput.max
      }
      if (this.maxDate || this.minDate) {
        return formatDate(this.maxDate || this.minDate, this.timeFormat)
      }
      return ''
    },

    timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format)
      }
      else {
        return 'HH:mm:ss'
      }
    },

    dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format)
      }
      else {
        return 'yyyy-MM-dd'
      }
    },

    enableMonthArrow() {
      const nextMonth = (this.leftMonth + 1) % 12
      const yearOffset = this.leftMonth + 1 >= 12 ? 1 : 0
      return this.unlinkPanels && new Date(this.leftYear + yearOffset, nextMonth) < new Date(this.rightYear, this.rightMonth)
    },

    enableYearArrow() {
      return this.unlinkPanels && this.rightYear * 12 + this.rightMonth - (this.leftYear * 12 + this.leftMonth + 1) >= 12
    },
  },

  watch: {
    minDate(val) {
      this.dateUserInput.min = null
      this.timeUserInput.min = null
      this.$nextTick(() => {
        if (this.$refs.maxTimePicker && this.maxDate && this.maxDate < this.minDate) {
          const format = 'HH:mm:ss'
          this.$refs.maxTimePicker.selectableRange = [
            [
              parseDate(formatDate(this.minDate, format), format),
              parseDate('23:59:59', format),
            ],
          ]
        }
      })
      if (val && this.$refs.minTimePicker) {
        this.$refs.minTimePicker.date = val
        this.$refs.minTimePicker.value = val
      }
    },

    maxDate(val) {
      this.dateUserInput.max = null
      this.timeUserInput.max = null
      if (val && this.$refs.maxTimePicker) {
        this.$refs.maxTimePicker.date = val
        this.$refs.maxTimePicker.value = val
      }
    },

    minTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.minTimePicker.date = this.minDate
          this.$refs.minTimePicker.value = this.minDate
          this.$refs.minTimePicker.adjustSpinners(true)
        })
      }
    },

    maxTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.maxTimePicker.date = this.maxDate
          this.$refs.maxTimePicker.value = this.maxDate
          this.$refs.maxTimePicker.adjustSpinners(true)
        })
      }
    },

    value(newVal) {
      if (!newVal) {
        this.minDate = null
        this.maxDate = null
      }
      else if (Array.isArray(newVal)) {
        this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null
        this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null
        if (this.minDate) {
          this.leftDate = this.minDate
          if (this.unlinkPanels && this.maxDate) {
            const minDateYear = this.minDate.getFullYear()
            const minDateMonth = this.minDate.getMonth()
            const maxDateYear = this.maxDate.getFullYear()
            const maxDateMonth = this.maxDate.getMonth()
            this.rightDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth
              ? nextMonth(this.maxDate)
              : this.maxDate
          }
          else {
            this.rightDate = nextMonth(this.leftDate)
          }
        }
        else {
          this.leftDate = calcDefaultValue(this.defaultValue)[0]
          this.rightDate = nextMonth(this.leftDate)
        }
      }
    },

    defaultValue(val) {
      if (!Array.isArray(this.value)) {
        const [left, right] = calcDefaultValue(val)
        this.leftDate = left
        this.rightDate = val && val[1] && this.unlinkPanels
          ? right
          : nextMonth(this.leftDate)
      }
    },
  },

  methods: {
    handleClear() {
      this.minDate = null
      this.maxDate = null
      this.leftDate = calcDefaultValue(this.defaultValue)[0]
      this.rightDate = nextMonth(this.leftDate)
      this.$emit('pick', null)
    },

    handleChangeRange(val) {
      this.minDate = val.minDate
      this.maxDate = val.maxDate
      this.rangeState = val.rangeState
    },

    handleDateInput(value, type) {
      this.dateUserInput[type] = value
      if (value.length !== this.dateFormat.length) {
        return
      }
      const parsedValue = parseDate(value, this.dateFormat)

      if (parsedValue) {
        if (typeof this.disabledDate === 'function'
          && this.disabledDate(new Date(parsedValue))) {
          return
        }
        if (type === 'min') {
          this.minDate = modifyDate(this.minDate || new Date(), parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate())
          this.leftDate = new Date(parsedValue)
          if (!this.unlinkPanels) {
            this.rightDate = nextMonth(this.leftDate)
          }
        }
        else {
          this.maxDate = modifyDate(this.maxDate || new Date(), parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate())
          this.rightDate = new Date(parsedValue)
          if (!this.unlinkPanels) {
            this.leftDate = prevMonth(parsedValue)
          }
        }
      }
    },

    handleDateChange(value, type) {
      const parsedValue = parseDate(value, this.dateFormat)
      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyDate(this.minDate, parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate())
          if (this.minDate > this.maxDate) {
            this.maxDate = this.minDate
          }
        }
        else {
          this.maxDate = modifyDate(this.maxDate, parsedValue.getFullYear(), parsedValue.getMonth(), parsedValue.getDate())
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate
          }
        }
      }
    },

    handleTimeInput(value, type) {
      this.timeUserInput[type] = value
      if (value.length !== this.timeFormat.length) {
        return
      }
      const parsedValue = parseDate(value, this.timeFormat)

      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds())
          this.$nextTick(_ => this.$refs.minTimePicker.adjustSpinners(true))
        }
        else {
          this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds())
          this.$nextTick(_ => this.$refs.maxTimePicker.adjustSpinners(true))
        }
      }
    },

    handleTimeChange(value, type) {
      const parsedValue = parseDate(value, this.timeFormat)
      if (parsedValue) {
        if (type === 'min') {
          this.minDate = modifyTime(this.minDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds())
          if (this.minDate > this.maxDate) {
            this.maxDate = this.minDate
          }
          this.$refs.minTimePicker.value = this.minDate
          this.minTimePickerVisible = false
        }
        else {
          this.maxDate = modifyTime(this.maxDate, parsedValue.getHours(), parsedValue.getMinutes(), parsedValue.getSeconds())
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate
          }
          this.$refs.maxTimePicker.value = this.minDate
          this.maxTimePickerVisible = false
        }
      }
    },

    handleRangePick(val, close = true) {
      const defaultTime = this.defaultTime || []
      const minDate = modifyWithTimeString(val.minDate, defaultTime[0])
      const maxDate = modifyWithTimeString(val.maxDate, defaultTime[1])

      if (this.maxDate === maxDate && this.minDate === minDate) {
        return
      }
      this.onPick && this.onPick(val)
      this.maxDate = maxDate
      this.minDate = minDate

      // workaround for https://github.com/ElemeFE/element/issues/7539, should remove this block when we don't have to care about Chromium 55 - 57
      setTimeout(() => {
        this.maxDate = maxDate
        this.minDate = minDate
      }, 10)
      if (!close || this.showTime) {
        return
      }
      this.handleConfirm()
    },

    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this)
      }
    },

    handleMinTimePick(value, visible, first) {
      this.minDate = this.minDate || new Date()
      if (value) {
        this.minDate = modifyTime(this.minDate, value.getHours(), value.getMinutes(), value.getSeconds())
      }

      if (!first) {
        this.minTimePickerVisible = visible
      }

      const maxDateLessThanMin = this.maxDate ? this.maxDate.getTime() < this.minDate.getTime() : false
      if (!this.maxDate || maxDateLessThanMin) {
        this.maxDate = new Date(this.minDate)
      }
    },

    handleMinTimeClose() {
      this.minTimePickerVisible = false
    },

    handleMaxTimePick(value, visible, first) {
      if (this.maxDate && value) {
        this.maxDate = modifyTime(this.maxDate, value.getHours(), value.getMinutes(), value.getSeconds())
      }

      if (!first) {
        this.maxTimePickerVisible = visible
      }

      if (this.maxDate && this.minDate && this.minDate.getTime() > this.maxDate.getTime()) {
        this.minDate = new Date(this.maxDate)
      }
    },

    handleMaxTimeClose() {
      this.maxTimePickerVisible = false
    },

    // leftPrev*, rightNext* need to take care of `unlinkPanels`
    leftPrevYear() {
      this.leftDate = prevYear(this.leftDate)
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate)
      }
    },

    leftPrevMonth() {
      this.leftDate = prevMonth(this.leftDate)
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate)
      }
    },

    rightNextYear() {
      if (!this.unlinkPanels) {
        this.leftDate = nextYear(this.leftDate)
        this.rightDate = nextMonth(this.leftDate)
      }
      else {
        this.rightDate = nextYear(this.rightDate)
      }
    },

    rightNextMonth() {
      if (!this.unlinkPanels) {
        this.leftDate = nextMonth(this.leftDate)
        this.rightDate = nextMonth(this.leftDate)
      }
      else {
        this.rightDate = nextMonth(this.rightDate)
      }
    },

    // leftNext*, rightPrev* are called when `unlinkPanels` is true
    leftNextYear() {
      this.leftDate = nextYear(this.leftDate)
    },

    leftNextMonth() {
      this.leftDate = nextMonth(this.leftDate)
    },

    rightPrevYear() {
      this.rightDate = prevYear(this.rightDate)
    },

    rightPrevMonth() {
      this.rightDate = prevMonth(this.rightDate)
    },

    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible)
      }
    },

    isValidValue(value) {
      return Array.isArray(value)
        && value && value[0] && value[1]
        && isDate(value[0]) && isDate(value[1])
        && value[0].getTime() <= value[1].getTime() && (
        typeof this.disabledDate === 'function'
          ? !this.disabledDate(value[0]) && !this.disabledDate(value[1])
          : true
      )
    },

    resetView() {
      // NOTE: this is a hack to reset {min, max}Date on picker open.
      // TODO: correct way of doing so is to refactor {min, max}Date to be dependent on value and internal selection state
      //       an alternative would be resetView whenever picker becomes visible, should also investigate date-panel's resetView
      if (this.minDate && this.maxDate == null) {
        this.rangeState.selecting = false
      }
      this.minDate = this.value && isDate(this.value[0]) ? new Date(this.value[0]) : null
      this.maxDate = this.value && isDate(this.value[0]) ? new Date(this.value[1]) : null
    },
  },
}
</script>

<template>
  <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      class="el-picker-panel el-date-range-picker-v2 el-popper"
      :class="[{
        'has-sidebar': $slots.sidebar || shortcuts,
        'has-time': showTime,
      }, popperClass]"
    >
      <div class="el-picker-panel__body-wrapper">
        <slot name="sidebar" class="el-picker-panel__sidebar" />
        <div v-if="shortcuts" class="el-picker-panel__sidebar">
          <button
            v-for="(shortcut, key) in shortcuts"
            :key="key"
            type="button"
            class="el-picker-panel__shortcut"
            @click="handleShortcutClick(shortcut)"
          >
            {{ shortcut.text }}
          </button>
        </div>
        <div class="el-picker-panel__body">
          <div v-if="showTime" class="el-date-range-picker-v2__time-header">
            <span class="el-date-range-picker-v2__editors-wrap">
              <span class="el-date-range-picker-v2__time-picker-wrap">
                <ElInput
                  size="small"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.startDate')"
                  class="el-date-range-picker-v2__editor"
                  :value="minVisibleDate"
                  @input="val => handleDateInput(val, 'min')"
                  @change="val => handleDateChange(val, 'min')"
                />
              </span>
              <span v-clickoutside="handleMinTimeClose" class="el-date-range-picker-v2__time-picker-wrap">
                <ElInput
                  size="small"
                  class="el-date-range-picker-v2__editor"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.startTime')"
                  :value="minVisibleTime"
                  @focus="minTimePickerVisible = true"
                  @input="val => handleTimeInput(val, 'min')"
                  @change="val => handleTimeChange(val, 'min')"
                />
                <TimePicker
                  ref="minTimePicker"
                  :time-arrow-control="arrowControl"
                  :visible="minTimePickerVisible"
                  @pick="handleMinTimePick"
                  @mounted="$refs.minTimePicker.format = timeFormat"
                />
              </span>
            </span>
            <span class="el-icon-arrow-right" />
            <span class="el-date-range-picker-v2__editors-wrap is-right">
              <span class="el-date-range-picker-v2__time-picker-wrap">
                <ElInput
                  size="small"
                  class="el-date-range-picker-v2__editor"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.endDate')"
                  :value="maxVisibleDate"
                  :readonly="!minDate"
                  @input="val => handleDateInput(val, 'max')"
                  @change="val => handleDateChange(val, 'max')"
                />
              </span>
              <span v-clickoutside="handleMaxTimeClose" class="el-date-range-picker-v2__time-picker-wrap">
                <ElInput
                  size="small"
                  class="el-date-range-picker-v2__editor"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.endTime')"
                  :value="maxVisibleTime"
                  :readonly="!minDate"
                  @focus="minDate && (maxTimePickerVisible = true)"
                  @input="val => handleTimeInput(val, 'max')"
                  @change="val => handleTimeChange(val, 'max')"
                />
                <TimePicker
                  ref="maxTimePicker"
                  :time-arrow-control="arrowControl"
                  :visible="maxTimePickerVisible"
                  @pick="handleMaxTimePick"
                  @mounted="$refs.maxTimePicker.format = timeFormat"
                />
              </span>
            </span>
          </div>
          <div class="el-picker-panel__content el-date-range-picker-v2__content is-left">
            <div class="el-date-range-picker-v2__header">
              <button
                type="button"
                class="el-picker-panel__icon-btn el-icon-d-arrow-left"
                @click="leftPrevYear"
              />
              <button
                type="button"
                class="el-picker-panel__icon-btn el-icon-arrow-left"
                @click="leftPrevMonth"
              />
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="{ 'is-disabled': !enableYearArrow }"
                class="el-picker-panel__icon-btn el-icon-d-arrow-right"
                @click="leftNextYear"
              />
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableMonthArrow"
                :class="{ 'is-disabled': !enableMonthArrow }"
                class="el-picker-panel__icon-btn el-icon-arrow-right"
                @click="leftNextMonth"
              />
              <div>{{ leftLabel }}</div>
            </div>
            <DateTable
              selection-mode="range"
              :date="leftDate"
              :default-value="defaultValue"
              :min-date="minDate"
              :max-date="maxDate"
              :range-state="rangeState"
              :disabled-date="disabledDate"
              :cell-class-name="cellClassName"
              :first-day-of-week="firstDayOfWeek"
              @changerange="handleChangeRange"
              @pick="handleRangePick"
            />
          </div>
          <div class="el-picker-panel__content el-date-range-picker-v2__content is-right">
            <div class="el-date-range-picker-v2__header">
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="{ 'is-disabled': !enableYearArrow }"
                class="el-picker-panel__icon-btn el-icon-d-arrow-left"
                @click="rightPrevYear"
              />
              <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableMonthArrow"
                :class="{ 'is-disabled': !enableMonthArrow }"
                class="el-picker-panel__icon-btn el-icon-arrow-left"
                @click="rightPrevMonth"
              />
              <button
                type="button"
                class="el-picker-panel__icon-btn el-icon-d-arrow-right"
                @click="rightNextYear"
              />
              <button
                type="button"
                class="el-picker-panel__icon-btn el-icon-arrow-right"
                @click="rightNextMonth"
              />
              <div>{{ rightLabel }}</div>
            </div>
            <DateTable
              selection-mode="range"
              :date="rightDate"
              :default-value="defaultValue"
              :min-date="minDate"
              :max-date="maxDate"
              :range-state="rangeState"
              :disabled-date="disabledDate"
              :cell-class-name="cellClassName"
              :first-day-of-week="firstDayOfWeek"
              @changerange="handleChangeRange"
              @pick="handleRangePick"
            />
          </div>
        </div>
      </div>
      <div v-if="showTime" class="el-picker-panel__footer">
        <ElButton
          size="mini"
          type="text"
          class="el-picker-panel__link-btn"
          @click="handleClear"
        >
          {{ t('el.datepicker.clear') }}
        </ElButton>
        <ElButton
          plain
          size="mini"
          class="el-picker-panel__link-btn"
          :disabled="btnDisabled"
          @click="handleConfirm(false)"
        >
          {{ t('el.datepicker.confirm') }}
        </ElButton>
      </div>
    </div>
  </transition>
</template>
