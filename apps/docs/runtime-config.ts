const DEFAULT_LOGO_PATH = '/images/element-logo.svg'
const DEFAULT_LOGO_SMALL_PATH = '/images/element-logo-small.svg'

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

function appendBase(base: string, path: string) {
  if (!path.startsWith('/')) {
    return path
  }
  if (base === '/') {
    return path
  }
  return `${base.replace(/\/$/, '')}${path}`
}

function resolveLogoPath(base: string, source: string | undefined, fallback: string) {
  const candidate = resolveString(source, fallback)
  if (/^(https?:)?\/\//.test(candidate) || candidate.startsWith('data:')) {
    return candidate
  }
  if (candidate.startsWith('/')) {
    return appendBase(base, candidate)
  }
  return appendBase(base, `/${candidate.replace(/^\/+/, '')}`)
}

export interface DocsRuntimeConfig {
  base: string
  defaultLanguage: string
  logo: {
    normal: string
    small: string
  }
}

const base = normalizeBasePath(import.meta.env.VITE_DOCS_BASE)

const runtimeConfig: DocsRuntimeConfig = {
  base,
  defaultLanguage: resolveString(import.meta.env.VITE_DOCS_DEFAULT_LANG, 'en-US'),
  logo: {
    normal: resolveLogoPath(base, import.meta.env.VITE_DOCS_LOGO_PATH, DEFAULT_LOGO_PATH),
    small: resolveLogoPath(base, import.meta.env.VITE_DOCS_LOGO_SMALL_PATH, DEFAULT_LOGO_SMALL_PATH),
  },
}

export default runtimeConfig
