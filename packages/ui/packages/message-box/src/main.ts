import merge from '../../../src/utils/merge'
import { isVNode } from '../../../src/utils/vdom'
// @ts-nocheck
import Vue from '../../../src/utils/vue'
import msgboxVue from './main.vue'

const defaults = {
  title: null,
  message: '',
  type: '',
  iconClass: '',
  showInput: false,
  showClose: true,
  modalFade: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  inputValue: null,
  inputPlaceholder: '',
  inputType: 'text',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: '',
  cancelButtonText: '',
  confirmButtonClass: '',
  cancelButtonClass: '',
  customClass: '',
  beforeClose: null,
  dangerouslyUseHTMLString: false,
  center: false,
  roundButton: false,
  distinguishCancelAndClose: false,
}

const MessageBoxConstructor = Vue.extend(msgboxVue)

let currentMsg, instance
let msgQueue = []

function defaultCallback(action) {
  if (currentMsg) {
    const callback = currentMsg.callback
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action)
      }
      else {
        callback(action)
      }
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.showInput) {
          currentMsg.resolve({ value: instance.inputValue, action })
        }
        else {
          currentMsg.resolve(action)
        }
      }
      else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
        currentMsg.reject(action)
      }
    }
  }
}

function initInstance() {
  instance = new MessageBoxConstructor({
    el: document.createElement('div'),
  })

  instance.callback = defaultCallback
}

function showNextMsg() {
  if (!instance) {
    initInstance()
  }
  instance.action = ''

  if (!instance.visible || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift()

      const options = currentMsg.options
      for (const prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback
      }

      const oldCb = instance.callback
      instance.callback = (action, instance) => {
        oldCb(action, instance)
        showNextMsg()
      }
      if (isVNode(instance.message)) {
        instance.$slots.default = [instance.message]
        instance.message = null
      }
      else {
        delete instance.$slots.default
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach((prop) => {
        if (instance[prop] === undefined) {
          instance[prop] = true
        }
      })
      document.body.appendChild(instance.$el)

      Vue.nextTick(() => {
        instance.visible = true
      })
    }
  }
}

function MessageBox(options, callback) {
  if (Vue.prototype.$isServer) { return }
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options,
    }
    if (typeof arguments[1] === 'string') {
      options.title = arguments[1]
    }
  }
  else if (options.callback && !callback) {
    callback = options.callback
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults, options),
        callback,
        resolve,
        reject,
      })

      showNextMsg()
    })
  }
  else {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults, options),
      callback,
    })

    showNextMsg()
  }
}

MessageBox.setDefaults = (defaults) => {
  MessageBox.defaults = defaults
}

MessageBox.alert = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  else if (title === undefined) {
    title = ''
  }
  return MessageBox(merge({
    title,
    message,
    $type: 'alert',
    closeOnPressEscape: false,
    closeOnClickModal: false,
  }, options))
}

MessageBox.confirm = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  else if (title === undefined) {
    title = ''
  }
  return MessageBox(merge({
    title,
    message,
    $type: 'confirm',
    showCancelButton: true,
  }, options))
}

MessageBox.prompt = (message, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  else if (title === undefined) {
    title = ''
  }
  return MessageBox(merge({
    title,
    message,
    showCancelButton: true,
    showInput: true,
    $type: 'prompt',
  }, options))
}

MessageBox.close = () => {
  instance.doClose()
  instance.visible = false
  msgQueue = []
  currentMsg = null
}

export default MessageBox
export { MessageBox }
