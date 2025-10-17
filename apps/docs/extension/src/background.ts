chrome.browserAction.onClicked.addListener((tab) => {
  if (typeof tab.id === 'number') {
    chrome.tabs.executeScript(tab.id, {
      file: 'entry.js',
    })
  }
})
