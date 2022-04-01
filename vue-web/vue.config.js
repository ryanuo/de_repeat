/*
 * @Author: Harry
 * @Date: 2022-03-30 18:30:18
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-04-01 15:02:49
 * @FilePath: \vue-web\vue.config.js
 */
const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // 文件加载设置为相对路径
  outputDir: 'dist',
  productionSourceMap: process.env.NODE_ENV !== 'pro',
  // lintOnSave: false, // 关闭eslint
  // productionSourceMap: true, // 生产环境下css 分离文件
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '论文降重小工具'
        return args
      })
  },
  devServer: {
    open: false, // 项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5030/', // 对应自己的接口，代理地址修改后必须重启项目
        // target: 'http://2e3e-60-223-236-230.ngrok.io', // 对应自己的接口，代理地址修改后必须重启项目
        // target: 'https://detect.mr90.top/', //对应自己的接口，代理地址修改后必须重启项目
        changeOrigin: true, // 是否允许跨域
        pathRewrite: {
          // 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/user/userInfo 时
          // 实际上访问的地址是：http://192.168.1.249:9527/user/userInfo,因为重写了 /api
          '^/api': ''
        }
      }
    }
  }
})
