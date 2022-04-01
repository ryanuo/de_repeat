<!--
 * @Author: Harry
 * @Date: 2022-03-31 11:54:44
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-04-01 14:31:04
 * @FilePath: \vue-web\src\views\TabnavView.vue
-->
<template>
  <div class="uu">
    <el-radio-group v-model="tabRouter" style="margin:30px 0" @change="tabRouterChange">
      <el-radio-button label="free" size="large">免费版</el-radio-button>
      <el-radio-button label="home" size="large">注册版(推荐)</el-radio-button>
    </el-radio-group>
    <router-view />
    <footer class="footer-wrap">
      Copyright © 2019-{{ currentYear }}
      <a href="https://u.mr90.top" target="_blank">Harry</a>. All rights reserved.
    </footer>
  </div>
</template>

<script>import { onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'TabnavView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      tabRouter: 'home',
      currentYear: new Date().getFullYear()
    })
    const tabRouterChange = function (name) {
      if (state.tabRouter === name) {
        console.log(1)
        console.log(router)
        router.replace({
          name
        })
      }
    }
    onMounted(() => {
      state.tabRouter = state.tabRouter !== route.name ? state.tabRouter = route.name : route.name
    })
    return { ...toRefs(state), tabRouterChange }
  }
}
</script>
<style lang='less' scoped>
.footer-wrap {
  position: absolute;
  bottom: 30px;
  text-align: center;
  transform: translateX(-50%);
  left: 50%;
}
</style>
