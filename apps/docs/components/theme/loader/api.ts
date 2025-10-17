import Element from 'main/index'
import { get, post } from './ajax'

const { version } = Element as { version: string }

const hostList = {
  local: 'http://localhost:3008/',
  // production: 'https://element-api.ele.me/element/theme/'
}

const host = hostList.local// hostList[process.env.FAAS_ENV] || hostList.production;

export function getVars<T = unknown>(): Promise<T> {
  return get<T>(`${host}getVariable?version=${version}`)
}

export function updateVars<T = unknown>(
  data: unknown,
  cb?: (xhr: XMLHttpRequest) => void,
): Promise<T> {
  return post<T>(`${host}updateVariable?version=${version}`, data, cb)
}
