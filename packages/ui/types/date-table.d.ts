import { ElementUIComponent } from './component'

export type DateTableSelectionMode = 'day' | 'week' | 'month' | 'year' | 'dates'

export interface DateTableRangeState {
  endDate: Date | null
  selecting: boolean
}

/** DateTable Component */
export declare class ElDateTable extends ElementUIComponent {
  /** Start day of week */
  firstDayOfWeek: number

  /** Selected value(s) */
  value: Date | Date[] | null

  /** Default value when picking range */
  defaultValue: Date | Date[] | null

  /** Current view date */
  date: Date

  /** Selection type */
  selectionMode: DateTableSelectionMode

  /** Display week numbers */
  showWeekNumber: boolean

  /** Disable specific dates */
  disabledDate: (date: Date) => boolean

  /** Custom class generator */
  cellClassName: (date: Date) => string

  /** Range start date */
  minDate: Date | null

  /** Range end date */
  maxDate: Date | null

  /** Internal range state */
  rangeState: DateTableRangeState
}
