import Vue from 'vue'

export interface DraggableOptions {
  start?: (event: MouseEvent) => void
  drag?: (event: MouseEvent) => void
  end?: (event: MouseEvent) => void
}

let isDragging = false

export default function draggable(element: HTMLElement, options: DraggableOptions = {}): void {
  const vuePrototype = Vue.prototype as Vue & { $isServer?: boolean }
  if (vuePrototype.$isServer) {
    return
  }

  const doc = document as Document & {
    onselectstart: ((this: Document, ev: Event) => boolean) | null
    ondragstart: ((this: Document, ev: DragEvent) => unknown) | null
  }

  const moveFn = (event: MouseEvent) => {
    options.drag?.(event)
  }
  const upFn = (event: MouseEvent) => {
    document.removeEventListener('mousemove', moveFn)
    document.removeEventListener('mouseup', upFn)
    doc.onselectstart = null
    doc.ondragstart = null

    isDragging = false

    options.end?.(event)
  }
  element.addEventListener('mousedown', (event: MouseEvent) => {
    if (isDragging) {
      return
    }
    doc.onselectstart = () => false
    doc.ondragstart = () => false

    document.addEventListener('mousemove', moveFn)
    document.addEventListener('mouseup', upFn)
    isDragging = true

    options.start?.(event)
  })
}
