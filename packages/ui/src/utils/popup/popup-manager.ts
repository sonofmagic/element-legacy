import { getGlobalConfig } from 'element-ui/src/utils/config-provider'
import { addClass, removeClass } from 'element-ui/src/utils/dom'
import Vue from 'element-ui/src/utils/vue'

const POPUP_MANAGER_KEY = '__ELEMENT_POPUP_MANAGER__'

interface PopupInstance {
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  close: () => void
  handleClose?: () => void
  handleAction?: (action: string) => void
}

interface ModalStackItem {
  id: string
  zIndex: number
  modalClass?: string
}

interface PopupGlobalContext {
  __ELEMENT_POPUP_MANAGER__?: PopupManager
}

export interface PopupManager {
  modalFade?: boolean
  modalStack: ModalStackItem[]
  modalDom?: HTMLElement
  getInstance: (id: string) => PopupInstance | undefined
  register: (id: string, instance: PopupInstance) => void
  deregister: (id: string) => void
  nextZIndex: () => number
  doOnModalClick: () => void
  openModal: (
    id: string,
    zIndex: number,
    dom?: HTMLElement | null,
    modalClass?: string,
    modalFade?: boolean,
  ) => void
  closeModal: (id: string) => void
  zIndex: number
}

function isServer() {
  return Boolean(Vue.prototype.$isServer)
}

function createPopupManager(): PopupManager {
  let hasModal = false
  let hasInitZIndex = false
  let zIndexValue: number

  const instances: Record<string, PopupInstance> = {}
  let manager!: PopupManager

  function getModal(): HTMLElement | undefined {
    if (isServer()) {
      return undefined
    }

    let modalDom = manager.modalDom

    if (modalDom) {
      hasModal = true
    }
    else {
      hasModal = false
      modalDom = document.createElement('div')
      manager.modalDom = modalDom

      modalDom.addEventListener('touchmove', (event) => {
        event.preventDefault()
        event.stopPropagation()
      })

      modalDom.addEventListener('click', () => {
        if (manager.doOnModalClick) {
          manager.doOnModalClick()
        }
      })
    }

    return modalDom
  }

  function getTopPopup(): PopupInstance | undefined {
    if (isServer()) {
      return undefined
    }

    if (manager.modalStack.length === 0) {
      return undefined
    }

    const topPopup = manager.modalStack[manager.modalStack.length - 1]

    if (!topPopup) {
      return undefined
    }

    return manager.getInstance(topPopup.id)
  }

  manager = {
    modalFade: true,
    modalStack: [] as ModalStackItem[],
    modalDom: undefined,
    getInstance(id: string) {
      return instances[id]
    },
    register(id: string, instance: PopupInstance) {
      if (id && instance) {
        instances[id] = instance
      }
    },
    deregister(id: string) {
      if (id) {
        delete instances[id]
      }
    },
    nextZIndex() {
      manager.zIndex += 1
      return manager.zIndex
    },
    doOnModalClick() {
      const topItem = manager.modalStack[manager.modalStack.length - 1]

      if (!topItem) {
        return
      }

      const instance = manager.getInstance(topItem.id)

      if (instance && instance.closeOnClickModal) {
        instance.close()
      }
    },
    openModal(id, modalZIndex, dom, modalClass, modalFadeFlag) {
      if (isServer()) {
        return
      }

      if (!id || modalZIndex === undefined) {
        return
      }

      manager.modalFade = modalFadeFlag

      const modalStack = manager.modalStack

      if (modalStack.some(item => item.id === id)) {
        return
      }

      const modalDom = getModal()

      if (!modalDom) {
        return
      }

      addClass(modalDom, 'v-modal')

      if (manager.modalFade && !hasModal) {
        addClass(modalDom, 'v-modal-enter')
      }

      if (modalClass) {
        modalClass.trim().split(/\s+/).forEach(item => addClass(modalDom, item))
      }

      window.setTimeout(() => {
        removeClass(modalDom, 'v-modal-enter')
      }, 200)

      if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
        dom.parentNode.appendChild(modalDom)
      }
      else {
        document.body.appendChild(modalDom)
      }

      if (modalZIndex) {
        modalDom.style.zIndex = String(modalZIndex)
      }

      modalDom.tabIndex = 0
      modalDom.style.display = ''

      modalStack.push({
        id,
        zIndex: modalZIndex,
        modalClass,
      })
    },
    closeModal(id) {
      const modalStack = manager.modalStack
      const modalDom = getModal()

      if (!modalDom) {
        return
      }

      if (modalStack.length > 0) {
        const topItem = modalStack[modalStack.length - 1]

        if (topItem && topItem.id === id) {
          if (topItem.modalClass) {
            topItem.modalClass.trim().split(/\s+/).forEach(item => removeClass(modalDom, item))
          }

          modalStack.pop()

          if (modalStack.length > 0) {
            modalDom.style.zIndex = String(modalStack[modalStack.length - 1].zIndex)
          }
        }
        else {
          for (let index = modalStack.length - 1; index >= 0; index -= 1) {
            if (modalStack[index].id === id) {
              modalStack.splice(index, 1)
              break
            }
          }
        }
      }

      if (modalStack.length === 0) {
        if (manager.modalFade) {
          addClass(modalDom, 'v-modal-leave')
        }

        window.setTimeout(() => {
          if (modalStack.length === 0) {
            if (modalDom.parentNode) {
              modalDom.parentNode.removeChild(modalDom)
            }

            modalDom.style.display = 'none'
            manager.modalDom = undefined
          }

          removeClass(modalDom, 'v-modal-leave')
        }, 200)
      }
    },
    zIndex: 0,
  }

  Object.defineProperty(manager, 'zIndex', {
    configurable: true,
    get() {
      if (!hasInitZIndex) {
        const elementConfig = getGlobalConfig()

        zIndexValue = elementConfig.zIndex ?? 2000
        hasInitZIndex = true
      }

      return zIndexValue
    },
    set(value: number) {
      zIndexValue = value
    },
  })

  if (!isServer() && typeof window !== 'undefined') {
    window.addEventListener('keydown', (event) => {
      const isEscape = event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27

      if (!isEscape) {
        return
      }

      const topPopup = getTopPopup()

      if (topPopup && topPopup.closeOnPressEscape) {
        if (typeof topPopup.handleClose === 'function') {
          topPopup.handleClose()
        }
        else if (typeof topPopup.handleAction === 'function') {
          topPopup.handleAction('cancel')
        }
        else {
          topPopup.close()
        }
      }
    })
  }

  return manager
}

function getGlobalContext(): PopupGlobalContext | undefined {
  if (typeof globalThis !== 'undefined') {
    return globalThis as PopupGlobalContext
  }

  if (typeof window !== 'undefined') {
    return window as unknown as PopupGlobalContext
  }

  return undefined
}

const globalContext = getGlobalContext()
const popupManager = globalContext?.[POPUP_MANAGER_KEY] ?? createPopupManager()

if (globalContext && !globalContext[POPUP_MANAGER_KEY]) {
  globalContext[POPUP_MANAGER_KEY] = popupManager
}

export default popupManager
