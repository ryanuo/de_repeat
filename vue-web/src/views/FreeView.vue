<!--
 * @Author: Harry
 * @Date: 2022-03-31 11:30:09
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 17:32:53
 * @FilePath: \vue-web\src\views\FreeView.vue
-->
<template>
  <div class>
    <div>
      <el-radio v-model="mode" label="simple" size="large" border>简单</el-radio>
      <el-radio v-model="mode" label="middle" size="large" border>中等</el-radio>
      <el-radio v-model="mode" label="high" size="large" border>高级</el-radio>
    </div>
    <div class="input-wrap">
      <el-input v-model="inputWord" :rows="7" type="textarea" placeholder="Please input" />
      <el-input v-model="endResult" :rows="7" type="textarea" placeholder disabled />
    </div>
    <el-button @click="judgeContent">开始</el-button>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import NProgress from 'nprogress'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-notification.css'
export default {
  setup() {
    const state = reactive({
      inputWord: '',
      endResult: '',
      mode: 'simple'
    })
    // 获取数据
    // 判断是否有内容
    const judgeContent = () => {
      if (state.inputWord.length === 0) {
        ElNotification({
          title: '提示',
          position: 'bottom-right',
          message: '你还未填写内容请填写后点击',
          type: 'warning'
        })
      } else {
        getResult()
      }
    }
    const getResult = async function () {
      NProgress.start()
      const { data: res } = await axios.get('https://de-repeat.vercel.app/api', {
        params: {
          query: state.inputWord,
          mode: state.mode
        }
      })
      if (res.status_code === 1) {
        state.endResult = res.data
        NProgress.done()
      }
      console.log(res)
    }
    return {
      ...toRefs(state),
      judgeContent
    }
  }
}
</script>
<style lang='less' scoped>
</style>
