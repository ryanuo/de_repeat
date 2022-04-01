/*
 * @Author: Harry
 * @Date: 2022-03-30 18:30:18
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-04-01 14:31:19
 * @FilePath: \vue-web\src\router\index.js
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/TabnavView.vue'),
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue')
      },
      {
        path: '/free',
        name: 'free',
        component: () => import('@/views/FreeView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
