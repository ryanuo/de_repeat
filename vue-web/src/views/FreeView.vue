<!--
 * @Author: Harry
 * @Date: 2022-03-31 11:30:09
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 15:52:55
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
    <el-button @click="getResult">开始</el-button>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import NProgress from 'nprogress'
import axios from 'axios'
export default {
  setup() {
    const state = reactive({
      inputWord: 'Unicode（统一码、万国码、单一码）是计算机科学领域里的一项业界标准,包括字符集、编码方案等。Unicode 是为了解决传统的字符编码方案的局限而产生的，它为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。',
      endResult: '',
      mode: 'simple'
    })
    // 获取数据
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
      getResult
    }
  }
}
</script>
<style lang='less' scoped>
</style>
