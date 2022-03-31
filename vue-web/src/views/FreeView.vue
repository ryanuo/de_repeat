<!--
 * @Author: Harry
 * @Date: 2022-03-31 11:30:09
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 22:05:02
 * @FilePath: \vue-web\src\views\FreeView.vue
-->
<template>
  <div class>
    <div>
      <el-radio v-model="mode" label="simple" border>简单</el-radio>
      <el-radio v-model="mode" label="middle" border>中等(推荐)</el-radio>
      <el-radio v-model="mode" label="high" border>高级</el-radio>
    </div>
    <div class="input-wrap">
      <el-input v-model="inputWord" :rows="7" type="textarea" placeholder="Please input" />
      <div class="copy-">
        <el-input v-model="endResult" :rows="7" type="textarea" placeholder disabled />
        <copysvg-view v-show="endResult.length !== 0" />
      </div>
    </div>
    <div class="startS" @click="judgeContent">开始转换</div>
  </div>
</template>

<script>
import { reactive, toRefs, defineAsyncComponent } from 'vue'
import NProgress from 'nprogress'
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
const CopysvgView = defineAsyncComponent(() => import('@/views/svg/CopysvgView.vue'))

export default {
  components: { CopysvgView },
  setup() {
    const state = reactive({
      inputWord: '',
      endResult: '',
      mode: 'middle',
      isError: false
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
      try {
        NProgress.start()
        const { data: res } = await axios.get('https://de-repeat.vercel.app/python', {
          params: {
            query: state.inputWord,
            mode: state.mode
          }
        })
        if (res.status_code === 1) {
          state.endResult = res.data
          NProgress.done()
        }
      } catch (error) {
        ElMessage.error('免费版连接超时，切换注册版使用')
        NProgress.done()
      }
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
