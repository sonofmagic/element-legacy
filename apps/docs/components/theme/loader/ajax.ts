const defaultError = 'Server Error 500'
const defaultTimeout = 'Request Timeout'

function xhr<T>(
  method: 'GET' | 'POST',
  url: string,
  data: unknown = null,
  cb?: (xhr: XMLHttpRequest) => void,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const request = new XMLHttpRequest()
    const doReject = (xhr: XMLHttpRequest) => {
      reject(xhr.response || xhr.statusText || defaultError)
    }
    request.open(method, url)
    request.setRequestHeader('Content-Type', 'application/json')
    request.timeout = 10000
    if (cb) {
      cb(request)
    }
    request.onload = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if ((request.status >= 200 && request.status < 300) || request.status === 304) {
          let response: unknown = request.response
          const type = request.getResponseHeader('Content-Type') ?? ''
          if (type.includes('zip')) {
            let filename = 'style.zip'
            const disposition = request.getResponseHeader('content-disposition')
            if (disposition && disposition.includes('attachment')) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
              const matches = filenameRegex.exec(disposition)
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
              }
            }
            const blob = new Blob([response as BlobPart], { type })
            const zipUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = zipUrl
            link.download = filename
            link.click()
            resolve(response as T)
            return
          }
          if (typeof request.response === 'string') {
            try {
              response = JSON.parse(request.response) as T
            }
            catch {
              response = request.response as unknown as T
            }
          }
          resolve(response as T)
        }
        else {
          doReject(request)
        }
      }
      else {
        doReject(request)
      }
    }
    request.onerror = () => {
      doReject(request)
    }
    request.ontimeout = () => {
      request.abort()
      reject(defaultTimeout)
    }
    const payload = data === null || data === undefined ? null : JSON.stringify(data)
    request.send(payload)
  })
}

export function post<T>(url: string, data: unknown, cb?: (xhr: XMLHttpRequest) => void): Promise<T> {
  return xhr<T>('POST', url, data, cb)
}

export function get<T>(url: string): Promise<T> {
  return xhr<T>('GET', url)
}
