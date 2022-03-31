
/*
 * @Author: Harry
 * @Date: 2022-03-30 22:08:46
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 21:46:52
 * @FilePath: \vue-web\src\utils\api\function\index.js
 */
// 防抖(合并版)
export function debounceMerge(fn, wait = 500, isImmediate = false) {
  let timerId = null
  let flag = true
  return function () {
    // @ts-ignore
    const context = this
    const args = arguments
    if (timerId) clearTimeout(timerId)
    if (isImmediate) {
      if (flag) {
        fn.apply(context, args)
        flag = false
      }
      timerId = setTimeout(function () {
        flag = true
      }, wait)
    } else {
      timerId = setTimeout(function () {
        fn.apply(context, args)
      }, wait)
    }
  }
}
