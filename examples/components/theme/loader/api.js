import Element from 'main/index.js'
import { get, post } from './ajax'

const { version } = Element

const hostList = {
  local: 'http://localhost:3008/',
  // production: 'https://element-api.ele.me/element/theme/'
}

const host = hostList.local// hostList[process.env.FAAS_ENV] || hostList.production;

export function getVars() {
  return get(`${host}getVariable?version=${version}`)
}

export function updateVars(data, cb) {
  return post(`${host}updateVariable?version=${version}`, data, cb)
}
