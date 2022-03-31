<!--
 * @Author: Harry
 * @Date: 2022-03-30 18:40:11
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 22:06:49
 * @FilePath: \vue-web\src\views\HomeView.vue
-->
<template>
  <div>
    <el-radio v-model="mode" label="simple" border>简单</el-radio>
    <el-radio v-model="mode" label="middle" border>中等(推荐)</el-radio>
    <el-radio v-model="mode" label="high" border>高级</el-radio>
  </div>
  <div class="input-wrap">
    <div class="close-">
      <el-input v-model="inputWord" :rows="7" type="textarea" placeholder="Please input" />
      <CloseSvg v-show="inputWord.length !== 0" @click="closeCon" />
    </div>
    <div class="copy-">
      <el-input v-model="endResult" :rows="7" type="textarea" placeholder disabled />
      <div v-show="endResult.length !== 0" @click="onCopy">
        <copysvg-view />
      </div>
    </div>
  </div>
  <div class="startS" @click="starSwitch">开始翻译</div>
  <el-dialog v-model="isLoginedVisible" :title="lwTitle" width="30%" :before-close="handleClose">
    <div class="remind-w">
      <remind-view />
    </div>
    <div class="appid-input">
      <el-input v-model="appid" clearable class="w-50 m-2" placeholder="请填写appid,获取方式点击感叹号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user-filled />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="secret-input">
      <el-input
        v-model="secret"
        clearable
        type="password"
        class="w-50 m-2"
        placeholder="请填写secret,获取方式点击感叹号"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <Key />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="btn-wrap">
      <el-button color="#626aef" style="color: white" @click="submitForm">登录</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, defineAsyncComponent, onMounted } from 'vue'
import { debounceMerge } from '@/utils/api/function'
import useClipboard from 'vue-clipboard3'
import md5 from 'js-md5'
import { Jsonp } from '@/http'
import { UserFilled, Key } from '@element-plus/icons-vue'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
const RemindView = defineAsyncComponent(() => import('@/views/RemindView.vue'))
const CopysvgView = defineAsyncComponent(() => import('@/views/svg/CopysvgView.vue'))
const CloseSvg = defineAsyncComponent(() => import('@/views/svg/CloseSvg.vue'))
export default {
  components: {
    RemindView,
    UserFilled,
    Key,
    CopysvgView,
    CloseSvg
  },
  setup() {
    const { toClipboard } = useClipboard()
    const state = reactive({
      isLoginedVisible: false,
      lwTitle: '论文降重小工具',
      appid: '',
      secret: '',
      inputWord: '论文降重小工具',
      tempResult: '',
      endResult: '',
      transList: {
        simple: ['zh en', 'en de', 'de zh'],
        middle: ['zh en', 'en de', 'de jp', 'jp pt', 'pt zh'],
        high: [
          'zh en',
          'en de',
          'de jp',
          'jp pt',
          'pt it',
          'it pl',
          'pl bul',
          'bul est',
          'est zh'
        ]
      },
      mode: 'middle'
    })
    // 生成Api参数
    const createApiParams = function (q, from, to) {
      const url = '//api.fanyi.baidu.com/api/trans/vip/translate'
      const data = {
        q,
        from,
        to,
        appid: state.appid,
        salt: '',
        sign: ''
      }

      data.salt = Math.floor(Math.random() * 10000000000)
      data.sign = md5(state.appid + q + data.salt + state.secret)
      return { url, data }
    }
    // 翻译
    const translate = async function (q, from, to) {
      const params = createApiParams(q, from, to)
      const res = await Jsonp(params.url, params.data)
      return res
    }
    const queen = function () {
      state.tempResult = state.inputWord;
      (async () => {
        for (let i = 0; i < state.transList[state.mode].length; i++) {
          const lang = state.transList[state.mode][i].split(' ')
          const res = await translate(state.tempResult, lang[0], lang[1])
          console.log(res)
          state.tempResult = res.trans_result[0].dst
          // console.log('result', dst)
          if (i === state.transList[state.mode].length - 1) {
            state.endResult = state.tempResult
            NProgress.done()
          }
        }
      })()
    }
    // 开始翻译
    const starSwitch = debounceMerge(function () {
      NProgress.start()
      queen(state.inputWord)
    }, 500, true)

    // 点击复制
    const onCopy = debounceMerge(function () {
      toClipboard(state.endResult)
      console.log(1)
    }, 500, true)
    // 登录
    const submitForm = function () {
      if (state.appid.length > 0 && state.secret.length > 0) {
        localStorage.setItem('token', JSON.stringify({
          appid: state.appid,
          secret: state.secret
        }))
        ElMessage({
          message: '填写成功，已保存到本地缓冲中',
          type: 'success'
        })
        state.isLoginedVisible = !state.isLoginedVisible
      } else {
        ElMessage({
          message: 'appid，serset不能为空！！',
          type: 'error'
        })
      }
    }
    // 清空内容
    const closeCon = function () {
      state.inputWord = ''
      state.endResult = ''
      state.tempResult = ''
    }
    onMounted(() => {
      const token = localStorage.getItem('token')
      console.log(token)
      if (token) {
        const a = JSON.parse(token)
        state.appid = a.appid
        state.secret = a.secret
        state.isLoginedVisible = false
        ElMessage({
          message: '已登录请放心使用,如有问题联系下方管理员',
          type: 'success'
        })
      } else {
        state.isLoginedVisible = true
      }
    })
    return {
      ...toRefs(state),
      createApiParams,
      translate,
      submitForm,
      queen,
      onCopy,
      closeCon,
      starSwitch
    }
  }
}
</script>

<style lang="less" scoped>
// 密码输入框
.appid-input,
.secret-input {
  margin: 20px 40px;
  // width: 100%;
}

.btn-wrap {
  padding: 40px 0 0 0;
  .el-button {
    width: 140px;
  }
}

.remind-w {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 30px;
  height: 30px;
  animation: tada 1s linear infinite;
  cursor: pointer;
}
</style>
