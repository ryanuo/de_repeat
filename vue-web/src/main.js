/*
 * @Author: Harry
 * @Date: 2022-03-30 18:30:18
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 21:44:45
 * @FilePath: \vue-web\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/reset.less'
import '@/assets/css/animate.css'
import 'nprogress/nprogress.css'
import 'element-plus/theme-chalk/el-notification.css'
import 'element-plus/theme-chalk/el-message.css'
const app = createApp(App)
app.use(router).mount('#app')
