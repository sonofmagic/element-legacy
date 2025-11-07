import { ElementUIComponent } from './component'

/** Scrollbar Component */
export declare class ElScrollbar extends ElementUIComponent {
  /** Whether to use native scrollbar */
  native: boolean

  /** Styles for the wrap element */
  wrapStyle: string | Record<string, any>

  /** Classes for the wrap element */
  wrapClass: string | Record<string, any>

  /** Classes for the view element */
  viewClass: string | Record<string, any>

  /** Styles for the view element */
  viewStyle: string | Record<string, any>

  /** Disable resize listener */
  noresize: boolean

  /** Tag name of the view element */
  tag: string
}
