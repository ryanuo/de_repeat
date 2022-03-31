/*
 * @Author: Harry
 * @Date: 2022-03-31 10:57:53
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 18:37:58
 * @FilePath: \vue-web\Interface\api\js.js
 */

module.exports = OnRequest
const url = require('url')
function OnRequest(request, response) {
  // console.log(request, response)
  // eslint-disable-next-line node/no-deprecated-api
  const arg1 = url.parse(request.url, true).query
  // 打印键值对中的值
  const query = arg1.query
  const gtk = arg1.gtk
  response.send({ sign: e(query, gtk) })
  response.end()
}
function n(r, o) { for (let t = 0; t < o.length - 2; t += 3) { let a = o.charAt(t + 2); a = a >= 'a' ? a.charCodeAt(0) - 87 : Number(a), a = o.charAt(t + 1) === '+' ? r >>> a : r << a, r = o.charAt(t) === '+' ? r + a & 4294967295 : r ^ a } return r } function e(r, gtk) { let i = null; const o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g); if (o === null) { const t = r.length; t > 30 && (r = '' + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10)) } else { for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++) { e[C] !== '' && f.push.apply(f, a(e[C].split(''))), C !== h - 1 && f.push(o[C]) } const g = f.length; g > 30 && (r = f.slice(0, 10).join('') + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join('') + f.slice(-10).join('')) } let u = void 0; const l = '' + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107); u = i !== null ? i : (i = gtk || '') || ''; for (var d = u.split('.'), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) { let A = r.charCodeAt(v); A < 128 ? S[c++] = A : (A < 2048 ? S[c++] = A >> 6 | 192 : ((64512 & A) === 55296 && v + 1 < r.length && (64512 & r.charCodeAt(v + 1)) === 56320 ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)), S[c++] = A >> 18 | 240, S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224, S[c++] = A >> 6 & 63 | 128), S[c++] = 63 & A | 128) } for (var p = m, F = '' + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ('' + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = '' + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ('' + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ('' + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++) { p += S[b], p = n(p, F) } return p = n(p, D), p ^= s, p < 0 && (p = (2147483647 & p) + 2147483648), p %= 1000000, p.toString() + '.' + (p ^ m) };
