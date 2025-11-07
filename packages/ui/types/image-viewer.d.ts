import { ElementUIComponent } from './component'

/** ImageViewer Component */
export declare class ElImageViewer extends ElementUIComponent {
  /** Image urls */
  urlList: string[]

  /** Custom z-index */
  zIndex: number

  /** Callback before switching image */
  onSwitch: (index: number) => void

  /** Callback before closing viewer */
  onClose: () => void

  /** Initial image index */
  initialIndex: number

  /** Whether to append to body */
  appendToBody: boolean

  /** Whether clicking on mask closes the viewer */
  maskClosable: boolean
}
