const DEFAULT_LOGO = new URL('./assets/images/element-logo.svg', import.meta.url).href
const DEFAULT_LOGO_SMALL = new URL('./assets/images/element-logo-small.svg', import.meta.url).href

function normalizeBasePath(input?: string | null): string {
  if (!input || !input.trim()) {
    return '/'
  }
  let base = input.trim()
  if (!base.startsWith('/')) {
    base = `/${base}`
  }
  if (!base.endsWith('/')) {
    base = `${base}/`
  }
  return base === '//' ? '/' : base
}

function resolveString(value: string | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback
}

export interface DocsRuntimeConfig {
  base: string
  defaultLanguage: string
  logo: {
    normal: string
    small: string
  }
}

const runtimeConfig: DocsRuntimeConfig = {
  base: normalizeBasePath(import.meta.env.VITE_DOCS_BASE),
  defaultLanguage: resolveString(import.meta.env.VITE_DOCS_DEFAULT_LANG, 'en-US'),
  logo: {
    normal: resolveString(import.meta.env.VITE_DOCS_LOGO_PATH, DEFAULT_LOGO),
    small: resolveString(import.meta.env.VITE_DOCS_LOGO_SMALL_PATH, DEFAULT_LOGO_SMALL),
  },
}

export default runtimeConfig
