const defaultError = 'Server Error 500'
const defaultTimeout = 'Request Timeout'
function xhr(method, url, data = null, cb) {
  return new window.Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const doReject = (xhr) => {
      reject(xhr.response || xhr.statusText || defaultError)
    }
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.timeout = 10000
    if (cb) { cb(xhr) }
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          let response = xhr.response
          const type = xhr.getResponseHeader('Content-Type')
          if (type.includes('zip')) {
            let filename = 'style.zip'
            const disposition = xhr.getResponseHeader('content-disposition')
            if (disposition && disposition.includes('attachment')) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
              const matches = filenameRegex.exec(disposition)
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
              }
            }
            const blob = new Blob([response], { type })
            const zipUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = zipUrl
            link.download = filename
            link.click()
            resolve(response)
            return
          }
          try {
            response = JSON.parse(xhr.response)
          }
          catch (e) {}
          resolve(response)
        }
        else {
          doReject(xhr)
        }
      }
      else {
        doReject(xhr)
      }
    }
    xhr.onerror = () => {
      doReject(xhr)
    }
    xhr.ontimeout = () => {
      xhr.abort()
      reject(defaultTimeout)
    }
    xhr.send(JSON.stringify(data))
  })
}

export function post(url, data, cb) {
  return xhr('POST', url, data, cb)
}

export function get(url) {
  return xhr('GET', url)
}
