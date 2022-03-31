/*
 * @Author: Harry
 * @Date: 2022-03-30 18:41:28
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 11:04:21
 * @FilePath: \vue-web\src\http.js
 */
import jsonp from 'jsonp'
export function Jsonp(url, data, option = null) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    jsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  for (const k in data) {
    const value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}

// 请求拦截
// axios.defaults.withCredentials = true
