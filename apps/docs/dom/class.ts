export function hasClass(element: HTMLElement, className: string): boolean {
  return new RegExp(`(\\s|^)${className}(\\s|$)`).test(element.className)
}

export function addClass(element: HTMLElement, className: string): void {
  if (!hasClass(element, className)) {
    element.className += ` ${className}`
  }
}

export function removeClass(element: HTMLElement, className: string): void {
  if (hasClass(element, className)) {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`)
    element.className = element.className.replace(reg, ' ')
  }
}

export function toggleClass(element: HTMLElement, className: string): void {
  if (hasClass(element, className)) {
    removeClass(element, className)
  }
  else {
    addClass(element, className)
  }
}
