import { ElementUIComponent, ElementUIComponentSize, ElementUIHorizontalAlignment } from './component'

export type DatePickerV2Type = 'year' | 'month' | 'date' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'dates'
export type DatePickerV2FirstDayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface DatePickerV2DisabledDateChecker {
  /**
   * Determine if `date` will be disabled in the picker
   *
   * @param date The date to check
   * @returns if `date` will be disabled in the picker
   */
  (date: Date): boolean
}

// Picked date range
export interface DatePickerV2DateRange {
  minDate: Date,
  maxDate: Date
}

export interface DatePickerV2PickEventHandler {
  /**
   * Callback function that triggers when picks a date range
   *
   * @param dateRange The selected date range
   */
  (dateRange: DatePickerV2DateRange): void
}

export interface DatePickerV2ShortcutClickEventHandler {
  /**
   * Callback function that triggers when clicking on a shortcut.
   * You can change the picker value by emitting the pick event.
   * Example: `vm.$emit('pick', new Date())`
   */
  (vm: ElDatePickerV2): void
}

/** Shortcut options */
export interface DatePickerV2Shortcut {
  /** Title of the shortcut */
  text: string,

  /** Callback function that triggers when picks a date range */
  onClick?: DatePickerV2ShortcutClickEventHandler
}

/** Options of el-date-picker */
export interface DatePickerV2Options {
  /** An object array to set shortcut options */
  shortcuts?: DatePickerV2Shortcut[]

  /** A function determining if a date is disabled. */
  disabledDate?: DatePickerV2DisabledDateChecker

  /** First day of week */
  firstDayOfWeek?: DatePickerV2FirstDayOfWeek

  /** A callback that triggers when the seleted date is changed. Only for daterange and datetimerange. */
  onPick?: DatePickerV2PickEventHandler
}

/** DatePicker Component */
export declare class ElDatePickerV2 extends ElementUIComponent {
  /** The value of the date picker */
  value: Date | string | Date[] | string[]

  /** Whether DatePicker is read only */
  readonly: boolean

  /** Whether DatePicker is disabled */
  disabled: boolean

  /** Size of Input */
  size: ElementUIComponentSize

  /** Whether the input is editable */
  editable: boolean

  /** Whether to show clear button */
  clearable: boolean

  /** Placeholder */
  placeholder: string

  /** Placeholder for the start date in range mode */
  startPlaceholder: string

  /** Placeholder for the end date in range mode */
  endPlaceholder: string

  /** Type of the picker */
  type: DatePickerV2Type

  /** Format of the picker */
  format: string

  /** Alignment */
  align: ElementUIHorizontalAlignment

  /** Custom class name for DatePicker's dropdown */
  popperClass: string

  /** Additional options, check the table below */
  pickerOptions: DatePickerV2Options

  /** Range separator */
  rangeSeparator: string

  /** Default date of the calendar */
  defaultValue: Date | number | string

  /** Format of binding value. If not specified, the binding value will be a Date object */
  valueFormat: string

  /** name for the inner native input */
  name: string

  /**
   * Focus the Input component
   */
  focus (): void
}
