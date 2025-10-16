<script lang="ts">
// @ts-nocheck
import ElButton from 'element-ui/packages/button'
import ElOption from 'element-ui/packages/option'
import ElSelect from 'element-ui/packages/select'
import Locale from 'element-ui/src/mixins/locale'
import {
  changeYearMonthAndClampDate,
  clearMilliseconds,
  clearTime,
  extractTimeFormat,
  getWeekNumber,
  isDate,
  modifyDate,
  modifyTime,
  modifyWithTimeString,
  nextMonth,
  nextYear,
  prevMonth,
  prevYear,
  timeWithinRange,
} from 'element-ui/src/utils/date-util'
import DateTable from '../basic/date-table.vue'
import MonthTable from '../basic/month-table.vue'
import YearTable from '../basic/year-table.vue'
import TimePicker from './time.vue'

const ENGLISH_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const ENGLISH_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default {

  components: {
    TimePicker,
    YearTable,
    MonthTable,
    DateTable,
    ElButton,
    ElSelect,
    ElOption,
  },
  mixins: [Locale],

  data() {
    return {
      popperClass: '',
      date: clearTime(new Date()),
      value: '',
      defaultValue: null, // use getDefaultValue() for time computation
      defaultTime: null,
      showTime: false,
      selectionMode: 'day',
      shortcuts: '',
      visible: false,
      currentView: 'date',
      disabledDate: '',
      cellClassName: '',
      selectableRange: [],
      firstDayOfWeek: 7,
      showWeekNumber: false,
      format: '',
      arrowControl: false,
    }
  },

  computed: {
    year() {
      return this.date.getFullYear()
    },

    month() {
      return this.date.getMonth()
    },

    week() {
      return getWeekNumber(this.date)
    },

    monthDate() {
      return this.date.getDate()
    },

    footerVisible() {
      return this.showTime || this.selectionMode === 'dates' || this.selectionMode === 'months' || this.selectionMode === 'years'
    },

    yearLabel() {
      const yearTranslation = this.t('el.datepicker.year')
      if (this.currentView === 'year') {
        const startYear = Math.floor(this.year / 10) * 10
        if (yearTranslation) {
          return `${startYear} ${yearTranslation} - ${startYear + 9} ${yearTranslation}`
        }
        return `${startYear} - ${startYear + 9}`
      }
      return `${this.year} ${yearTranslation}`
    },

    timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format)
      }
      else {
        return 'HH:mm:ss'
      }
    },

    isSingleDateView() {
      return this.selectionMode === 'day' && this.currentView === 'date'
    },

    monthOptions() {
      return Array.from({ length: 12 }, (_, index) => {
        const full = this.t(`el.datepicker.month${index + 1}`)
        const englishIndex = ENGLISH_MONTHS.indexOf(full)
        const label = englishIndex !== -1 ? ENGLISH_MONTHS_SHORT[englishIndex] : full
        return {
          value: index,
          label,
        }
      })
    },

    yearOptions() {
      const currentYear = this.year
      const startYear = currentYear - 100
      const endYear = currentYear + 100
      const options = []
      for (let year = startYear; year <= endYear; year++) {
        options.push({
          value: year,
          label: `${year}`,
        })
      }
      return options
    },

    todayLabel() {
      return this.t('el.datepicker.today') || 'Today'
    },
  },

  watch: {
    value(val) {
      if (this.selectionMode === 'dates' && this.value) {
        return
      }
      if (this.selectionMode === 'months' && this.value) {
        return
      }
      if (this.selectionMode === 'years' && this.value) {
        return
      }
      if (isDate(val)) {
        this.date = new Date(val)
      }
      else {
        this.date = this.getDefaultValue()
      }
    },

    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : clearTime(new Date())
      }
    },

    selectionMode(newVal) {
      if (newVal === 'month') {
        /* istanbul ignore next */
        if (this.currentView !== 'year' || this.currentView !== 'month') {
          this.currentView = 'month'
        }
      }
      else if (newVal === 'dates') {
        this.currentView = 'date'
      }
      else if (newVal === 'years') {
        this.currentView = 'year'
      }
      else if (newVal === 'months') {
        this.currentView = 'month'
      }
    },
  },

  methods: {
    proxyTimePickerDataProperties() {
      const format = (timeFormat) => {
        this.$refs.timepicker.format = timeFormat
      }
      const value = (value) => {
        this.$refs.timepicker.value = value
      }
      const date = (date) => {
        this.$refs.timepicker.date = date
      }
      const selectableRange = (selectableRange) => {
        this.$refs.timepicker.selectableRange = selectableRange
      }

      this.$watch('value', value)
      this.$watch('date', date)
      this.$watch('selectableRange', selectableRange)

      format(this.timeFormat)
      value(this.value)
      date(this.date)
      selectableRange(this.selectableRange)
    },

    handleClear() {
      this.date = this.getDefaultValue()
      this.$emit('pick', null)
    },

    emit(value, ...args) {
      if (!value) {
        this.$emit('pick', value, ...args)
      }
      else if (Array.isArray(value)) {
        const dates = value.map(date => this.showTime ? clearMilliseconds(date) : clearTime(date))
        this.$emit('pick', dates, ...args)
      }
      else {
        this.$emit('pick', this.showTime ? clearMilliseconds(value) : clearTime(value), ...args)
      }
    },

    // resetDate() {
    //   this.date = new Date(this.date);
    // },

    showMonthPicker() {
      this.currentView = 'month'
      this.$emit('hover-date', null)
    },

    showYearPicker() {
      this.currentView = 'year'
      this.$emit('hover-date', null)
    },

    // XXX: 没用到
    // handleLabelClick() {
    //   if (this.currentView === 'date') {
    //     this.showMonthPicker();
    //   } else if (this.currentView === 'month') {
    //     this.showYearPicker();
    //   }
    // },

    prevMonth() {
      this.date = prevMonth(this.date)
    },

    nextMonth() {
      this.date = nextMonth(this.date)
    },

    prevYear() {
      if (this.currentView === 'year') {
        this.date = prevYear(this.date, 10)
      }
      else {
        this.date = prevYear(this.date)
      }
    },

    nextYear() {
      if (this.currentView === 'year') {
        this.date = nextYear(this.date, 10)
      }
      else {
        this.date = nextYear(this.date)
      }
    },

    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this)
      }
    },

    handleTimePick(value, visible, source) {
      if (isDate(value)) {
        const base = this.value ? this.value : this.getDefaultValue()
        const defaulted = !this.value && this.defaultTime
          ? modifyWithTimeString(base, this.defaultTime)
          : base
        const newDate = modifyTime(defaulted, value.getHours(), value.getMinutes(), value.getSeconds())
        this.date = newDate
        const emitVisible = typeof visible === 'boolean' ? visible : true
        const args = []
        if (source === 'preview') {
          args.push('preview')
        }
        this.emit(this.date, emitVisible, ...args)
      }
      else {
        this.emit(value, true)
      }
    },

    handleCellHover(date) {
      this.$emit('hover-date', date)
    },

    handleMonthDropdownVisible(visible) {
      if (!visible) {
        return
      }
      this.$nextTick(() => {
        this.centerSelectOption('monthSelect', this.month)
      })
    },

    handleYearDropdownVisible(visible) {
      if (!visible) {
        return
      }
      this.$nextTick(() => {
        this.centerSelectOption('yearSelect', this.year)
      })
    },

    centerSelectOption(refName, value) {
      const select = this.$refs[refName]
      if (!select || !select.$refs || !select.$refs.popper) {
        return
      }
      const option = select.getOption(value)
      if (!option || !option.$el) {
        return
      }
      const wrap = select.$refs.popper.$el.querySelector('.el-select-dropdown__wrap')
      if (!wrap) {
        return
      }
      const optionEl = option.$el
      const target = optionEl.offsetTop - Math.max((wrap.clientHeight - optionEl.offsetHeight) / 2, 0)
      wrap.scrollTop = target
    },

    handleMonthPick(month) {
      if (this.selectionMode === 'month') {
        this.date = modifyDate(this.date, this.year, month, 1)
        this.emit(this.date)
      }
      else if (this.selectionMode === 'months') {
        this.emit(month, true)
      }
      else {
        this.date = changeYearMonthAndClampDate(this.date, this.year, month)
        // TODO: should emit intermediate value ??
        // this.emit(this.date);
        this.currentView = 'date'
      }
    },

    handleDatePick(value) {
      if (this.selectionMode === 'day') {
        let newDate = this.value
          ? modifyDate(this.value, value.getFullYear(), value.getMonth(), value.getDate())
          : modifyWithTimeString(value, this.defaultTime)
        // change default time while out of selectableRange
        if (!this.checkDateWithinRange(newDate)) {
          newDate = modifyDate(this.selectableRange[0][0], value.getFullYear(), value.getMonth(), value.getDate())
        }
        this.date = newDate
        this.emit(this.date, this.showTime)
      }
      else if (this.selectionMode === 'week') {
        this.emit(value.date)
      }
      else if (this.selectionMode === 'dates') {
        this.emit(value, true) // set false to keep panel open
      }
    },

    handleYearPick(year) {
      if (this.selectionMode === 'year') {
        this.date = modifyDate(this.date, year, 0, 1)
        this.emit(this.date)
      }
      else if (this.selectionMode === 'years') {
        this.emit(year, true)
      }
      else {
        this.date = changeYearMonthAndClampDate(this.date, year, this.month)
        // TODO: should emit intermediate value ??
        // this.emit(this.date, true);
        this.currentView = 'month'
      }
    },

    handleMonthChange(month) {
      const targetMonth = typeof month === 'number' ? month : Number(month)
      if (Number.isNaN(targetMonth)) {
        return
      }
      this.date = changeYearMonthAndClampDate(this.date, this.year, targetMonth)
    },

    handleYearChange(year) {
      const targetYear = typeof year === 'number' ? year : Number(year)
      if (Number.isNaN(targetYear)) {
        return
      }
      this.date = changeYearMonthAndClampDate(this.date, targetYear, this.month)
    },

    selectToday() {
      this.changeToNow()
    },

    changeToNow() {
      // NOTE: not a permanent solution
      //       consider disable "now" button in the future
      if ((!this.disabledDate || !this.disabledDate(new Date())) && this.checkDateWithinRange(new Date())) {
        this.date = new Date()
        this.emit(this.date)
      }
    },

    confirm() {
      if (this.selectionMode === 'dates' || this.selectionMode === 'months' || this.selectionMode === 'years') {
        this.emit(this.value)
      }
      else {
        // value were emitted in handle{Date,Time}Pick, nothing to update here
        // deal with the scenario where: user opens the picker, then confirm without doing anything
        const value = this.value
          ? this.value
          : modifyWithTimeString(this.getDefaultValue(), this.defaultTime)
        this.date = new Date(value) // refresh date
        this.emit(value)
      }
    },

    resetView() {
      if (this.selectionMode === 'month' || this.selectionMode === 'months') {
        this.currentView = 'month'
      }
      else if (this.selectionMode === 'year' || this.selectionMode === 'years') {
        this.currentView = 'year'
      }
      else {
        this.currentView = 'date'
      }
    },

    handleBeforeEnter() {
      if (!this.showTime) {
        return
      }
      const syncSpinners = () => {
        const timepicker = this.$refs.timepicker
        if (!timepicker || typeof timepicker.adjustSpinners !== 'function') {
          return
        }
        if ('needInitAdjust' in timepicker) {
          timepicker.needInitAdjust = true
        }
        timepicker.adjustSpinners(true)
      }
      this.$nextTick(() => {
        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(syncSpinners)
        }
        else {
          syncSpinners()
        }
      })
    },

    handleEnter() {
      document.body.addEventListener('keydown', this.handleKeydown)
    },

    handleLeave() {
      this.$emit('dodestroy')
      document.body.removeEventListener('keydown', this.handleKeydown)
      if (!this.showTime) {
        return
      }
      const timepicker = this.$refs.timepicker
      if (timepicker && 'needInitAdjust' in timepicker) {
        timepicker.needInitAdjust = true
      }
    },

    handleKeydown(event) {
      const keyCode = event.keyCode
      const list = [38, 40, 37, 39]
      const timepickerEl = this.$refs.timepicker && this.$refs.timepicker.$el
      const isInTimePanel = timepickerEl ? timepickerEl.contains(event.target) : false
      if (this.visible && !isInTimePanel) {
        if (list.includes(keyCode)) {
          this.handleKeyControl(keyCode)
          event.stopPropagation()
          event.preventDefault()
        }
        if (keyCode === 13) { // Enter
          this.emit(this.date, false)
        }
      }
    },

    handleKeyControl(keyCode) {
      const mapping = {
        year: {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setFullYear(date.getFullYear() + step),
        },
        month: {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setMonth(date.getMonth() + step),
        },
        week: {
          38: -1,
          40: 1,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step * 7),
        },
        day: {
          38: -7,
          40: 7,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step),
        },
      }
      const mode = this.selectionMode
      const year = 3.1536e10
      const now = this.date.getTime()
      const newDate = new Date(this.date.getTime())
      while (Math.abs(now - newDate.getTime()) <= year) {
        const map = mapping[mode]
        map.offset(newDate, map[keyCode])
        if (typeof this.disabledDate === 'function' && this.disabledDate(newDate)) {
          continue
        }
        this.date = newDate
        this.$emit('pick', newDate, true)
        break
      }
    },

    isValidValue(value) {
      return value && !Number.isNaN(Number(value)) && (
        typeof this.disabledDate === 'function'
          ? !this.disabledDate(value)
          : true
      ) && this.checkDateWithinRange(value)
    },

    getDefaultValue() {
      // if default-value is set, return it
      // otherwise, return start of today to keep time selection at 00:00:00
      return this.defaultValue ? new Date(this.defaultValue) : clearTime(new Date())
    },

    checkDateWithinRange(date) {
      return this.selectableRange.length > 0
        ? timeWithinRange(date, this.selectableRange, this.format || 'HH:mm:ss')
        : true
    },
  },
}
</script>

<template>
  <transition name="el-zoom-in-top" @before-enter="handleBeforeEnter" @after-enter="handleEnter" @after-leave="handleLeave">
    <div
      v-show="visible"
      class="el-picker-panel el-date-picker-v2 el-popper"
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
          <div class="el-date-picker-v2__main">
            <div
              v-show="currentView !== 'time'"
              class="el-date-picker-v2__header"
              :class="{
                'el-date-picker-v2__header--bordered': currentView === 'year' || currentView === 'month',
                'el-date-picker-v2__header--simple': isSingleDateView,
              }"
            >
              <template v-if="isSingleDateView">
                <div class="el-date-picker-v2__header-controls">
                  <ElSelect
                    ref="monthSelect"
                    class="el-date-picker-v2__month-select"
                    :value="month"
                    size="small"
                    :popper-append-to-body="false"
                    popper-class="el-date-picker-v2__select-dropdown"
                    @change="handleMonthChange"
                    @visible-change="handleMonthDropdownVisible"
                  >
                    <ElOption
                      v-for="item in monthOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                  <ElSelect
                    ref="yearSelect"
                    class="el-date-picker-v2__year-select"
                    :value="year"
                    size="small"
                    :popper-append-to-body="false"
                    popper-class="el-date-picker-v2__select-dropdown"
                    @change="handleYearChange"
                    @visible-change="handleYearDropdownVisible"
                  >
                    <ElOption
                      v-for="item in yearOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                </div>
                <button
                  v-if="!showTime"
                  type="button"
                  class="el-date-picker-v2__today-btn"
                  @click="selectToday"
                >
                  {{ todayLabel }}
                </button>
              </template>
              <template v-else>
                <button
                  type="button"
                  :aria-label="t(`el.datepicker.prevYear`)"
                  class="el-picker-panel__icon-btn el-date-picker-v2__prev-btn el-icon-d-arrow-left"
                  @click="prevYear"
                />
                <button
                  v-show="currentView === 'date'"
                  type="button"
                  :aria-label="t(`el.datepicker.prevMonth`)"
                  class="el-picker-panel__icon-btn el-date-picker-v2__prev-btn el-icon-arrow-left"
                  @click="prevMonth"
                />
                <span
                  role="button"
                  class="el-date-picker-v2__header-label"
                  @click="showYearPicker"
                >{{ yearLabel }}</span>
                <span
                  v-show="currentView === 'date'"
                  role="button"
                  class="el-date-picker-v2__header-label"
                  :class="{ active: currentView === 'month' }"
                  @click="showMonthPicker"
                >{{ t(`el.datepicker.month${month + 1}`) }}</span>
                <button
                  type="button"
                  :aria-label="t(`el.datepicker.nextYear`)"
                  class="el-picker-panel__icon-btn el-date-picker-v2__next-btn el-icon-d-arrow-right"
                  @click="nextYear"
                />
                <button
                  v-show="currentView === 'date'"
                  type="button"
                  :aria-label="t(`el.datepicker.nextMonth`)"
                  class="el-picker-panel__icon-btn el-date-picker-v2__next-btn el-icon-arrow-right"
                  @click="nextMonth"
                />
              </template>
            </div>

            <div class="el-picker-panel__content">
              <DateTable
                v-show="currentView === 'date'"
                :selection-mode="selectionMode"
                :first-day-of-week="firstDayOfWeek"
                :value="value"
                :default-value="defaultValue ? new Date(defaultValue) : null"
                :date="date"
                :cell-class-name="cellClassName"
                :disabled-date="disabledDate"
                @cell-hover="handleCellHover"
                @pick="handleDatePick"
              />
              <YearTable
                v-show="currentView === 'year'"
                :selection-mode="selectionMode"
                :value="value"
                :default-value="defaultValue ? new Date(defaultValue) : null"
                :date="date"
                :disabled-date="disabledDate"
                @pick="handleYearPick"
              />
              <MonthTable
                v-show="currentView === 'month'"
                :selection-mode="selectionMode"
                :value="value"
                :default-value="defaultValue ? new Date(defaultValue) : null"
                :date="date"
                :disabled-date="disabledDate"
                @pick="handleMonthPick"
              />
            </div>
          </div>
          <div v-if="showTime" class="el-date-picker-v2__time-wrapper">
            <TimePicker
              ref="timepicker"
              :time-arrow-control="arrowControl"
              :visible="true"
              @pick="handleTimePick"
              @mounted="proxyTimePickerDataProperties"
            />
          </div>
        </div>
      </div>

      <div
        v-show="footerVisible && (currentView === 'date' || currentView === 'month' || currentView === 'year')"
        class="el-picker-panel__footer"
      >
        <div class="el-date-picker-v2__footer-actions">
          <ElButton
            v-show="selectionMode !== 'dates' && selectionMode !== 'months' && selectionMode !== 'years'"
            size="mini"
            type="text"
            class="el-picker-panel__link-btn el-date-picker-v2__footer-now"
            @click="changeToNow"
          >
            {{ t('el.datepicker.now') }}
          </ElButton>
          <ElButton
            type="primary"
            size="mini"
            class="el-date-picker-v2__footer-confirm"
            @click="confirm"
          >
            Confirm
          </ElButton>
        </div>
      </div>
    </div>
  </transition>
</template>
