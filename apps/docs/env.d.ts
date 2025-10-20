interface ImportMetaEnv {
  readonly VITE_DOCS_BASE?: string
  readonly VITE_DOCS_DEFAULT_LANG?: string
  readonly VITE_DOCS_LOGO_PATH?: string
  readonly VITE_DOCS_LOGO_SMALL_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
