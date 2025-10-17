export {}

declare global {
  interface ChromeStorageArea {
    get: (keys: string[] | string | Record<string, unknown> | null, callback: (items: Record<string, unknown>) => void) => void
    set: (items: Record<string, unknown>, callback?: () => void) => void
  }

  interface ChromeTabs {
    executeScript: (tabId: number | undefined, details: { file: string }, callback?: (result: unknown[]) => void) => void
  }

  interface ChromeBrowserAction {
    onClicked: {
      addListener: (callback: (tab: { id?: number }) => void) => void
    }
  }

  interface Chrome {
    storage?: {
      local?: ChromeStorageArea
    }
    tabs: ChromeTabs
    browserAction: ChromeBrowserAction
  }

  const chrome: Chrome
}
