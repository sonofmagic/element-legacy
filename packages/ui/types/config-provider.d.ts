import { ElementUIComponent, ElementUIComponentSize } from './component'

export interface ElConfigProviderButtonConfig {
  autoInsertSpace?: boolean
}

export interface ElConfigProviderMessageConfig {
  max?: number
}

/** Config Provider Component */
export declare class ElConfigProvider extends ElementUIComponent {
  /** Custom wrapper element tag, default is div */
  tag: string

  /** Default component size for this provider */
  size?: ElementUIComponentSize

  /** Base z-index for popups created under this provider */
  zIndex?: number

  /** BEM namespace */
  namespace?: string

  /** Button related global configuration */
  button?: ElConfigProviderButtonConfig

  /** Message related global configuration */
  message?: ElConfigProviderMessageConfig
}
