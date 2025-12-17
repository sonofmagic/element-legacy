/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import sinon from 'sinon'
import Vue from 'vue'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.config.preserveWhitespace = false

// Define version placeholder expected by entry exports during tests.
;(globalThis as any).__ELEMENT_LEGACY_VERSION__ = '__TEST_VERSION__'

// Expose sinon for legacy tests that expect a global spy/stub helper.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).sinon = sinon

type DoneFn = (error?: unknown) => void

const wrapDoneFn = <T extends (...args: any[]) => any>(fn?: T) => {
  if (!fn || fn.length === 0) return fn

  return (...args: any[]) => new Promise<void>((resolve, reject) => {
    const done: DoneFn = (error?: unknown) => (error ? reject(error) : resolve())
    try {
      // @ts-expect-error legacy callback signature
      fn(done, ...args)
    }
    catch (error) {
      reject(error)
    }
  })
}

const patchAsyncAPI = (name: 'it' | 'test' | 'beforeEach' | 'afterEach' | 'beforeAll' | 'afterAll') => {
  const original = (globalThis as any)[name]
  if (!original) return

  const patched = (title: any, fn?: any, options?: any) => original(title, wrapDoneFn(fn), options)

  patched.skip = (title: any, fn?: any, options?: any) => original.skip(title, wrapDoneFn(fn), options)
  patched.only = (title: any, fn?: any, options?: any) => original.only(title, wrapDoneFn(fn), options)
  patched.todo = original.todo?.bind(original)
  patched.concurrent = original.concurrent?.bind(original)
  patched.sequential = original.sequential?.bind(original)
  patched.each = original.each?.bind(original)

  ;(globalThis as any)[name] = patched
}

;(['it', 'test', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'] as const).forEach(patchAsyncAPI)

// Legacy mocha-style aliases used across old suites.
const maybeAlias = (from: 'before' | 'after', to: 'beforeAll' | 'afterAll') => {
  const globalRef = globalThis as any
  if (!globalRef[from] && globalRef[to]) {
    globalRef[from] = globalRef[to]
  }
}

maybeAlias('before', 'beforeAll')
maybeAlias('after', 'afterAll')

if (typeof window !== 'undefined') {
  window.requestAnimationFrame = (cb: FrameRequestCallback) => {
    const id = setTimeout(() => cb(performance.now?.() ?? Date.now()), 0)
    // @ts-expect-error align return type with RAF handle
    return id
  }
  window.cancelAnimationFrame = (id: number) => {
    clearTimeout(id)
  }
}

const normalizeText = (value?: string | null) => (value ?? '').replace(/\s+/g, ' ').trim()

const getStyle = (el: HTMLElement) => el.ownerDocument?.defaultView?.getComputedStyle(el)

const isHidden = (el: HTMLElement | null): boolean => {
  if (!el) return false
  const style = getStyle(el)
  if (!style) return false
  if (style.display === 'none' || style.visibility === 'hidden' || el.hidden) return true
  return isHidden(el.parentElement)
}

Object.defineProperty(HTMLElement.prototype, 'innerText', {
  configurable: true,
  get() {
    if (isHidden(this)) return ''

    const collect = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        if (isHidden(element)) return ''
        return Array.from(element.childNodes).map(collect).join('')
      }
      return ''
    }

    return normalizeText(collect(this))
  },
  set(value: string) {
    this.textContent = value
  },
})

const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')
if (originalTextContentDescriptor?.get && originalTextContentDescriptor?.set) {
  Object.defineProperty(Node.prototype, 'textContent', {
    configurable: true,
    get() {
      const raw = originalTextContentDescriptor.get!.call(this)
      return normalizeText(raw)
    },
    set(value: string) {
      originalTextContentDescriptor.set!.call(this, value)
    },
  })
}

const cssFallbacks: Record<string, string> = {
  'lineHeight': '16px',
  'line-height': '16px',
  'fontSize': '14px',
  'font-size': '14px',
  'width': '16px',
  'height': '16px',
  'paddingTop': '0px',
  'paddingBottom': '0px',
  'paddingLeft': '0px',
  'paddingRight': '0px',
  'padding-top': '0px',
  'padding-bottom': '0px',
  'padding-left': '0px',
  'padding-right': '0px',
  'borderTopWidth': '0px',
  'borderBottomWidth': '0px',
  'border-top-width': '0px',
  'border-bottom-width': '0px',
  'boxSizing': 'border-box',
  'box-sizing': 'border-box',
}

const toRgb = (hex: string) => {
  const value = hex.replace('#', '')
  const normalized = value.length === 3
    ? value.split('').map(char => char + char).join('')
    : value
  const int = Number.parseInt(normalized, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgb(${r}, ${g}, ${b})`
}

const normalizeBoxShadow = (value?: string | null) => {
  if (!value) return value ?? ''
  const tokens = value.trim().split(/\s+/)
  const colorIndex = tokens.findIndex(token => token.startsWith('#') || token.startsWith('rgb'))
  const colorToken = colorIndex >= 0 ? tokens.splice(colorIndex, 1)[0] : ''
  const color = colorToken
    ? (colorToken.startsWith('#') ? toRgb(colorToken) : colorToken)
    : 'rgb(0, 0, 0)'
  const offsets = tokens.map(token => (token.endsWith('px') ? token : `${token}px`))
  while (offsets.length < 4) offsets.push('0px')
  return `${color} ${offsets.join(' ')}`
}

const toKebab = (prop: string) => prop.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)
const originalGetComputedStyle = window.getComputedStyle
window.getComputedStyle = function patchedGetComputedStyle(element: Element, pseudoElt?: string | null) {
  const style = originalGetComputedStyle.call(window, element, pseudoElt)
  if (!style) return style

  const resolve = (prop: string) => {
    const isTextarea = element instanceof HTMLTextAreaElement
    const textareaFallbacks: Record<string, string> = {
      'padding-top': '5px',
      'padding-bottom': '5px',
      'border-top-width': '1px',
      'border-bottom-width': '1px',
      'line-height': '21px',
      'font-size': '14px',
      'box-sizing': 'border-box',
    }
    const raw = typeof style.getPropertyValue === 'function'
      ? style.getPropertyValue(prop)
      : (style as any)[prop]
    const inlineValue = (element as HTMLElement | null)?.style?.[prop as keyof CSSStyleDeclaration]
    if (prop === 'boxShadow' || prop === 'box-shadow') {
      const shadow = normalizeBoxShadow(raw || inlineValue)
      if (shadow) return shadow
    }
    const isEmpty = raw === '' || raw === undefined || raw === null || raw === 'auto' || raw === 'normal'
    if (isEmpty && inlineValue) {
      return inlineValue
    }
    const kebab = toKebab(prop)
    if (isTextarea && textareaFallbacks[kebab] !== undefined) {
      return textareaFallbacks[kebab]
    }
    if (isEmpty) {
      return cssFallbacks[prop] ?? cssFallbacks[kebab] ?? ''
    }
    return raw
  }

  return new Proxy(style, {
    get(target, prop, receiver) {
      if (prop === 'getPropertyValue') {
        return (name: string) => resolve(name)
      }
      const value = Reflect.get(target, prop, receiver) as unknown
      if (typeof prop === 'string') {
        const resolved = resolve(prop)
        if (resolved !== '') return resolved
      }
      return value
    },
  })
}

const resolveNumeric = (value?: string | null) => {
  const parsed = Number.parseFloat(value ?? '')
  return Number.isNaN(parsed) ? 0 : parsed
}

const resolveSize = (el: HTMLElement, key: 'width' | 'height') => {
  const style = getStyle(el)
  if (!style) return 0
  return resolveNumeric(style[key]) || resolveNumeric(style.lineHeight) || resolveNumeric(style.fontSize)
}

const defaultSize = (el: HTMLElement, key: 'width' | 'height') => {
  const classes = Array.from(el.classList ?? [])
  const sliderSize = key === 'width' ? 100 : 100
  const thumbSize = key === 'width' ? 12 : 12
  if (classes.some(name => name.startsWith('el-color-hue-slider')) && !classes.includes('el-color-hue-slider__thumb')) {
    return sliderSize
  }
  if (classes.some(name => name.startsWith('el-color-alpha-slider')) && !classes.includes('el-color-alpha-slider__thumb')) {
    return sliderSize
  }
  if (classes.includes('el-color-hue-slider__thumb') || classes.includes('el-color-alpha-slider__thumb')) {
    return thumbSize
  }
  if (classes.includes('el-progress-bar__innerText')) {
    return 12
  }
  const sizeFromStyle = resolveSize(el, key)
  const scrollSize = key === 'width'
    ? (Number.isFinite(el.scrollWidth) ? el.scrollWidth : 0)
    : (Number.isFinite(el.scrollHeight) ? el.scrollHeight : 0)
  const derivedSize = Math.max(sizeFromStyle, scrollSize)
  return derivedSize || 16
}

const computeOffsetTop = (el: HTMLElement) => {
  const parent = el.parentElement
  if (!parent) return 0
  const siblings = Array.from(parent.children) as HTMLElement[]
  let offset = resolveNumeric(getStyle(parent)?.paddingTop)
  for (const sibling of siblings) {
    if (sibling === el) break
    offset += sibling.offsetHeight || resolveSize(sibling, 'height')
  }
  return offset
}

const resolveScrollOffset = (el: HTMLElement) => {
  let offset = 0
  let parent = el.parentElement
  while (parent) {
    offset += parent.scrollTop || 0
    parent = parent.parentElement
  }
  return offset
}

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() {
    return resolveSize(this, 'width')
  },
})

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  get() {
    return resolveSize(this, 'height')
  },
})

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  get() {
    return defaultSize(this as HTMLElement, 'width')
  },
})

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  get() {
    return defaultSize(this as HTMLElement, 'height')
  },
})

Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
  configurable: true,
  get() {
    const el = this as HTMLElement
    if (el.classList?.contains('el-progress-bar__innerText')) {
      return 12
    }
    return computeOffsetTop(el)
  },
})

Object.defineProperty(Element.prototype, 'offsetTop', {
  configurable: true,
  get() {
    // Delegate to the HTMLElement override if available.
    const el = this as HTMLElement
    if (typeof (el as any).classList !== 'undefined' && el.classList.contains('el-progress-bar__innerText')) {
      return 12
    }
    return computeOffsetTop(el)
  },
})

const originalBoxShadow = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'boxShadow')
if (originalBoxShadow?.get) {
  Object.defineProperty(CSSStyleDeclaration.prototype, 'boxShadow', {
    configurable: true,
    get() {
      const raw = originalBoxShadow.get!.call(this) as string
      return normalizeBoxShadow(raw)
    },
    set(value: string) {
      originalBoxShadow.set?.call(this, value)
    },
  })
}

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRectPatched() {
  const rect = originalGetBoundingClientRect ? originalGetBoundingClientRect.call(this) : {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }
  const width = rect.width || defaultSize(this as HTMLElement, 'width')
  const height = rect.height || defaultSize(this as HTMLElement, 'height')
  const top = computeOffsetTop(this as HTMLElement) - resolveScrollOffset(this as HTMLElement)
  const left = rect.left ?? 0
  return {
    ...rect,
    width,
    height,
    top,
    left,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
  }
}

const scrollTopKey = Symbol('scrollTop')
Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
  configurable: true,
  get() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any)[scrollTopKey] ?? 0
  },
  set(value: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this as any)[scrollTopKey] = value
    this.dispatchEvent(new Event('scroll'))
  },
})

class MockImage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onload: ((this: any, ev: Event) => unknown) | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((this: any, ev: Event | string) => unknown) | null = null
  private _src = ''
  private _attrs: Record<string, string> = {}
  width = 100
  height = 100
  naturalWidth = 100
  naturalHeight = 100

  decode() {
    return Promise.resolve()
  }

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value
    setTimeout(() => {
      if (!this._src) return
      const shouldFail = /fail/i.test(this._src)
      const event = new Event(shouldFail ? 'error' : 'load')
      const handler = shouldFail ? this.onerror : this.onload
      if (typeof handler === 'function') {
        handler.call(this, event)
      }
      else if (typeof (this as any).dispatchEvent === 'function') {
        ;(this as any).dispatchEvent(event)
      }
    }, 0)
  }

  setAttribute(name: string, value: string) {
    this._attrs[name] = value
  }

  getAttribute(name: string) {
    return this._attrs[name]
  }
}

;(globalThis as any).Image = MockImage

Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
  configurable: true,
  get() {
    const style = getStyle(this as unknown as HTMLElement)
    const isElTextarea = (this as HTMLElement).classList?.contains('el-textarea__inner') || (this as HTMLElement).tagName === 'TEXTAREA'
    const lineHeight = isElTextarea ? 21 : (resolveNumeric(style?.lineHeight) || 16)
    const paddingTop = isElTextarea ? 5 : resolveNumeric(style?.paddingTop)
    const paddingBottom = isElTextarea ? 5 : resolveNumeric(style?.paddingBottom)
    const paddingSize = paddingTop + paddingBottom
    const lines = Math.max((this as HTMLTextAreaElement).value?.split('\n').length || 1, 1)
    return Math.max(lineHeight * lines + paddingSize, lineHeight + paddingSize)
  },
})

const nativeImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')
if (nativeImageSrc?.set && nativeImageSrc?.get) {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true,
    get() {
      return nativeImageSrc.get!.call(this)
    },
    set(value: string) {
      nativeImageSrc.set!.call(this, value)
      setTimeout(() => {
        const shouldFail = /fail/i.test(value)
        const event = new Event(shouldFail ? 'error' : 'load')
        const handler = shouldFail ? (this as HTMLImageElement).onerror : (this as HTMLImageElement).onload
        if (typeof handler === 'function') {
          handler.call(this, event)
        }
        else {
          ;(this as HTMLImageElement).dispatchEvent(event)
        }
      }, 0)
    },
  })
}

const nativeSetAttribute = HTMLImageElement.prototype.setAttribute
HTMLImageElement.prototype.setAttribute = function setAttributePatched(name: string, value: string) {
  nativeSetAttribute.call(this, name, value)
  if (name === 'src') {
    const url = String(value)
    setTimeout(() => {
      const shouldFail = /fail/i.test(url)
      const event = new Event(shouldFail ? 'error' : 'load')
      const handler = shouldFail ? (this as HTMLImageElement).onerror : (this as HTMLImageElement).onload
      if (typeof handler === 'function') {
        handler.call(this, event)
      }
      else {
        ;(this as HTMLImageElement).dispatchEvent(event)
      }
    }, 0)
  }
}
