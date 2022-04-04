<!--
 * @Author: Harry
 * @Date: 2022-03-31 11:30:09
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-04-01 18:19:45
 * @FilePath: \vue-web\src\views\FreeView.vue
-->
<template>
  <div class>
    <div>
      <el-radio v-model="mode" label="simple" border>初级</el-radio>
      <el-radio v-model="mode" label="middle" border>中等(推荐)</el-radio>
      <el-radio v-model="mode" label="high" border>高级</el-radio>
    </div>
    <div class="input-wrap">
      <div class="close- c1">
        <el-input v-model="inputWord" :rows="7" type="textarea" placeholder="Please input" />
        <CloseSvg v-show="inputWord.length !== 0" @click="closeCon" />
      </div>
      <div class="copy- c1">
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
import axios from '@/utils/http'
import { ElMessage, ElNotification } from 'element-plus'
import { debounceMerge } from '@/utils/api/function'
const CopysvgView = defineAsyncComponent(() => import('@/views/svg/CopysvgView.vue'))
const CloseSvg = defineAsyncComponent(() => import('@/views/svg/CloseSvg.vue'))
export default {
  components: { CopysvgView, CloseSvg },
  setup() {
    const state = reactive({
      inputWord: '',
      endResult: '',
      mode: 'middle',
      isError: false
    })
    // 获取数据
    // 判断是否有内容
    const judgeContent = debounceMerge(() => {
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
    }, 300, true)
    const getResult = async function () {
      try {
        NProgress.start()
        const { data: res } = await axios.post('/api/v3', {
          query: state.inputWord,
          mode: state.mode
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
