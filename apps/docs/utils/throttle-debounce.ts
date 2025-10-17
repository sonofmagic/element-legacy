type Procedure = (...args: any[]) => void

type Throttled<T extends Procedure> = ((...args: Parameters<T>) => void) & {
  cancel: () => void
}

type Debounced<T extends Procedure> = ((...args: Parameters<T>) => void) & {
  cancel: () => void
}

export function throttle<T extends Procedure>(delay: number, callback: T): Throttled<T> {
  let lastExec = 0
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastContext: unknown

  const execute = () => {
    lastExec = Date.now()
    timeout = null
    if (lastArgs) {
      callback.apply(lastContext as any, lastArgs)
    }
  }

  const throttled: Throttled<T> = function (...args: Parameters<T>) {
    const now = Date.now()
    lastArgs = args
    lastContext = this
    const remaining = delay - (now - lastExec)

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      execute()
    } else if (!timeout) {
      timeout = setTimeout(execute, remaining)
    }
  }

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastArgs = null
  }

  return throttled
}

export function debounce<T extends Procedure>(delay: number, callback: T): Debounced<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastContext: unknown

  const debounced: Debounced<T> = function (...args: Parameters<T>) {
    lastArgs = args
    lastContext = this
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      timeout = null
      if (!lastArgs) return
      callback.apply(lastContext as any, lastArgs)
      lastArgs = null
    }, delay)
  }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastArgs = null
  }

  return debounced
}
