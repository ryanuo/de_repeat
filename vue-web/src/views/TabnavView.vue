<!--
 * @Author: Harry
 * @Date: 2022-03-31 11:54:44
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 12:31:16
 * @FilePath: \vue-web\src\views\TabnavView.vue
-->
<template>
  <div class="uu">
    <el-radio-group v-model="tabRouter" style="margin:30px 0" @change="tabRouterChange">
      <el-radio-button label="free" size="large">免费版</el-radio-button>
      <el-radio-button label="home" size="large">注册版</el-radio-button>
    </el-radio-group>
    <router-view />
    <!-- <footer>
    Copyright © 2020-2021
    <a href="https://u.mr90.top" target="_blank">Harry</a>. All rights reserved.
    </footer>-->
  </div>
</template>

<script>import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'TabnavView',
  setup() {
    const router = useRouter()
    const state = reactive({
      tabRouter: 'free'
    })
    const tabRouterChange = function (name) {
      if (state.tabRouter === name) {
        console.log(1)
        router.replace({
          name
        })
      }
    }
    return { ...toRefs(state), tabRouterChange }
  }
}
</script>
<style lang='less' scoped>
</style>
