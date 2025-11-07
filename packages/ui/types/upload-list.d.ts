import { ElementUIComponent } from './component'
import { ElUploadInternalFileDetail, ListType } from './upload'

/** UploadList Component */
export declare class ElUploadList extends ElementUIComponent {
  /** Files rendered in the list */
  files: ElUploadInternalFileDetail[]

  /** Disable all operations */
  disabled: boolean

  /** Preview handler */
  handlePreview?: (file: ElUploadInternalFileDetail) => void

  /** File list visual type */
  listType: ListType
}
