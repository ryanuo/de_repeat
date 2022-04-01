/*
 * @Author: Harry
 * @Date: 2022-03-30 18:30:18
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-04-01 15:02:15
 * @FilePath: \vue-web\babel.config.js
 */
const plugins = []
if (process.env.NODE_ENV === 'pro') { // todo  if判断是否打包,打包环境下控制台去掉console.log,也可去掉if判断，整个项目不会出现console.log(不建议)
  plugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: plugins
}
