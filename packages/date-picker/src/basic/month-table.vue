<script lang="ts">
// @ts-nocheck
import Locale from 'element-ui/src/mixins/locale'
import { getDayCountOfMonth, isDate, nextDate, range } from 'element-ui/src/utils/date-util'
import { hasClass } from 'element-ui/src/utils/dom'
import { arrayFind, arrayFindIndex, coerceTruthyValueToArray } from 'element-ui/src/utils/util'

function datesInMonth(year, month) {
  const numOfDays = getDayCountOfMonth(year, month)
  const firstDay = new Date(year, month, 1)
  return range(numOfDays).map(n => nextDate(firstDay, n))
}

function clearDate(date) {
  return new Date(date.getFullYear(), date.getMonth())
}

function getMonthTimestamp(time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return clearDate(new Date(time)).getTime()
  }
  else if (time instanceof Date) {
    return clearDate(time).getTime()
  }
  else {
    return Number.NaN
  }
}

// remove the first element that satisfies `pred` from arr
// return a new array if modification occurs
// return the original array otherwise
function removeFromArray(arr, pred) {
  const idx = typeof pred === 'function' ? arrayFindIndex(arr, pred) : arr.indexOf(pred)
  return idx >= 0 ? [...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr
}
export default {

  mixins: [Locale],
  props: {
    disabledDate: {},
    value: {},
    selectionMode: {
      default: 'month',
    },
    minDate: {},

    maxDate: {},
    defaultValue: {
      validator(val) {
        // null or valid Date Object
        return val === null || isDate(val) || (Array.isArray(val) && val.every(isDate))
      },
    },
    date: {},
    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false,
        }
      },
    },
  },

  data() {
    return {
      months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      lastRow: null,
      lastColumn: null,
    }
  },

  computed: {
    rows() {
      // TODO: refactory rows / getCellClasses
      const rows = Array.from({ length: 3 }, () => [])
      const disabledDate = this.disabledDate
      const selectedDate = []
      const now = getMonthTimestamp(new Date())
      const minDateTimestamp = getMonthTimestamp(this.minDate)
      const maxDateTimestamp = getMonthTimestamp(this.maxDate)
      const hasMin = !Number.isNaN(minDateTimestamp)
      const hasMax = !Number.isNaN(maxDateTimestamp)

      for (let i = 0; i < 3; i++) {
        const row = rows[i]
        for (let j = 0; j < 4; j++) {
          const cell = {
            column: j,
            disabled: false,
            end: false,
            inRange: false,
            row: i,
            selected: false,
            start: false,
            text: 0,
            type: 'normal',
          }

          const index = i * 4 + j
          const time = new Date(this.date.getFullYear(), index).getTime()
          cell.inRange = hasMin && hasMax && time >= minDateTimestamp && time <= maxDateTimestamp
          cell.start = Boolean(this.minDate) && time === minDateTimestamp
          cell.end = Boolean(this.maxDate) && time === maxDateTimestamp
          const isToday = time === now

          if (isToday) {
            cell.type = 'today'
          }
          cell.text = index
          const cellDate = new Date(time)
          cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate)
          cell.selected = arrayFind(selectedDate, date => date.getTime() === cellDate.getTime())

          row[j] = cell
        }
      }
      return rows
    },
  },

  watch: {
    'rangeState.endDate': function (newVal) {
      this.markRange(this.minDate, newVal)
    },

    minDate(newVal, oldVal) {
      if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate)
      }
    },

    maxDate(newVal, oldVal) {
      if (getMonthTimestamp(newVal) !== getMonthTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate)
      }
    },
  },

  methods: {
    cellMatchesDate(cell, date) {
      const value = new Date(date)
      return this.date.getFullYear() === value.getFullYear() && Number(cell.text) === value.getMonth()
    },
    getCellStyle(cell) {
      const style = {}
      const year = this.date.getFullYear()
      const today = new Date()
      const month = cell.text
      const defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : []
      style.disabled = typeof this.disabledDate === 'function'
        ? datesInMonth(year, month).every(this.disabledDate)
        : false
      style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), date => date.getFullYear() === year && date.getMonth() === month) >= 0
      style.today = today.getFullYear() === year && today.getMonth() === month
      style.default = defaultValue.some(date => this.cellMatchesDate(cell, date))

      if (cell.inRange) {
        style['in-range'] = true

        if (cell.start) {
          style['start-date'] = true
        }

        if (cell.end) {
          style['end-date'] = true
        }
      }
      return style
    },
    getMonthOfCell(month) {
      const year = this.date.getFullYear()
      return new Date(year, month, 1)
    },
    markRange(minDate, maxDate) {
      minDate = getMonthTimestamp(minDate)
      maxDate = getMonthTimestamp(maxDate) || minDate;
      [minDate, maxDate] = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)]
      const rows = this.rows
      for (let i = 0, k = rows.length; i < k; i++) {
        const row = rows[i]
        for (let j = 0, l = row.length; j < l; j++) {
          const cell = row[j]
          const index = i * 4 + j
          const time = new Date(this.date.getFullYear(), index).getTime()

          cell.inRange = minDate && time >= minDate && time <= maxDate
          cell.start = minDate && time === minDate
          cell.end = maxDate && time === maxDate
        }
      }
    },
    handleMouseMove(event) {
      if (!this.rangeState.selecting) {
        return
      }

      let target = event.target
      if (target.tagName === 'A') {
        target = target.parentNode.parentNode
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode
      }
      if (target.tagName !== 'TD') {
        return
      }

      const row = target.parentNode.rowIndex
      const column = target.cellIndex
      // can not select disabled date
      if (this.rows[row][column].disabled) {
        return
      }

      // only update rangeState when mouse moves to a new cell
      // this avoids frequent Date object creation and improves performance
      if (row !== this.lastRow || column !== this.lastColumn) {
        this.lastRow = row
        this.lastColumn = column
        this.$emit('changerange', {
          minDate: this.minDate,
          maxDate: this.maxDate,
          rangeState: {
            selecting: true,
            endDate: this.getMonthOfCell(row * 4 + column),
          },
        })
      }
    },
    handleMonthTableClick(event) {
      let target = event.target
      if (target.tagName === 'A') {
        target = target.parentNode.parentNode
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode
      }
      if (target.tagName !== 'TD') {
        return
      }
      if (hasClass(target, 'disabled')) {
        return
      }
      const column = target.cellIndex
      const row = target.parentNode.rowIndex
      const month = row * 4 + column
      const newDate = this.getMonthOfCell(month)
      if (this.selectionMode === 'range') {
        if (!this.rangeState.selecting) {
          this.$emit('pick', { minDate: newDate, maxDate: null })
          this.rangeState.selecting = true
        }
        else {
          if (newDate >= this.minDate) {
            this.$emit('pick', { minDate: this.minDate, maxDate: newDate })
          }
          else {
            this.$emit('pick', { minDate: newDate, maxDate: this.minDate })
          }
          this.rangeState.selecting = false
        }
      }
      else if (this.selectionMode === 'months') {
        const value = this.value || []
        const year = this.date.getFullYear()
        const newValue = arrayFindIndex(value, date => date.getFullYear() === year && date.getMonth() === month) >= 0
          ? removeFromArray(value, date => date.getTime() === newDate.getTime())
          : [...value, newDate]
        this.$emit('pick', newValue)
      }
      else {
        this.$emit('pick', month)
      }
    },
  },
}
</script>

<template>
  <table class="el-month-table" @click="handleMonthTableClick" @mousemove="handleMouseMove">
    <tbody>
      <tr v-for="(row, key) in rows" :key="key">
        <td v-for="(cell, key) in row" :key="key" :class="getCellStyle(cell)">
          <div>
            <a class="cell">{{ t(`el.datepicker.months.${months[cell.text]}`) }}</a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
