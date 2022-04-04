<!--
 * @Author: Harry
 * @Date: 2022-03-30 18:40:11
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-04-04 15:25:22
 * @FilePath: \vue-web\src\views\HomeView.vue
-->
<template>
  <div :ref="homeRef" class="home-wrap">
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
        <div v-show="endResult.length !== 0" @click="onCopy">
          <copysvg-view />
        </div>
      </div>
    </div>
    <div class="startS" @click="starSwitch">开始转换</div>
    <el-dialog
      v-model="isLoginedVisible"
      :title="lwTitle"
      :width="PageWidth"
      :before-close="handleClose"
    >
      <div class="remind-w">
        <remind-view @click="remindClick" />
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
    <div class="lay-out">
      <layout-svg v-if="token" @click="LayOut" />
      <SigninSvg v-else @click="isLoginedVisible = true" />
    </div>
  </div>
  <div class="el-drawer-w">
    <el-drawer v-model="drawerT" title="使用方法" :direction="direction" :before-close="handleClose">
      <h6>1.使用原理</h6>
      <span class="content-left">利用百度翻译通用API在不通语言间转换, 由于不通语言语序不通, 转换后可有效降重.</span>
      <h6>2.使用步骤</h6>
      <span class="content-left">
        ①提供两种模式建议
        <em>注册版</em>
      </span>
      <span class="content-left">
        ②
        <a href="https://api.fanyi.baidu.com/api/trans/product/prodinfo" target="_blank">注册</a>百度翻译api
      </span>
      <span class="content-left">
        ③选择
        <a href="https://api.fanyi.baidu.com/api/trans/product/apichoose" target="_blank">开通</a>通用型翻译
      </span>
      <span class="content-left">
        ③
        <a href="https://api.fanyi.baidu.com/manage/developer" target="_blank">查询</a>appid和secret
      </span>
      <span class="content-left">
        ④
        <a href="https://m.mr90.top/de_repeat/#/home" target="_blank">注册版页面</a>填入appid和秘钥
      </span>
      <h6>3.隐私保护</h6>
      <span class="content-left">注：所有查询过的信息，以及账号密码，仅个人可知。</span>
    </el-drawer>
  </div>
</template>

<script>
import { reactive, toRefs, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { debounceMerge } from '@/utils/api/function'
import useClipboard from 'vue-clipboard3'
import md5 from 'js-md5'
import { Jsonp } from '@/http'
import { UserFilled, Key } from '@element-plus/icons-vue'
import NProgress from 'nprogress'
import { ElMessage, ElNotification } from 'element-plus'
const RemindView = defineAsyncComponent(() => import('@/views/RemindView.vue'))
const CopysvgView = defineAsyncComponent(() => import('@/views/svg/CopysvgView.vue'))
const CloseSvg = defineAsyncComponent(() => import('@/views/svg/CloseSvg.vue'))
const LayoutSvg = defineAsyncComponent(() => import('@/views/svg/LayoutSvg.vue'))
const SigninSvg = defineAsyncComponent(() => import('@/views/svg/SigninSvg.vue'))
export default {
  components: {
    RemindView,
    UserFilled,
    Key,
    CopysvgView,
    CloseSvg,
    LayoutSvg,
    SigninSvg
  },
  setup(props, context) {
    const { toClipboard } = useClipboard()
    const state = reactive({
      isLoginedVisible: false,
      lwTitle: '论文降重小工具',
      appid: '',
      secret: '',
      inputWord: '',
      tempResult: '',
      direction: 'ltr',
      endResult: '',
      drawerT: false,
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
      mode: 'middle',
      PageWidth: '30%',
      token: false
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
      const token = localStorage.getItem('token')
      if (!state.inputWord) {
        ElNotification({
          title: '提示',
          position: 'bottom-right',
          message: '你还未填写内容请填写后点击',
          type: 'error'
        })
      } else if (!token) {
        ElNotification({
          title: '提示',
          position: 'bottom-right',
          message: '您还未登录',
          type: 'error'
        })
      } else {
        NProgress.start()
        try {
          queen(state.inputWord)
        } catch (error) {
          ElNotification({
            title: '提示',
            position: 'bottom-right',
            message: '账户密码有误，点击左上角退出，重新输入',
            type: 'error'
          })
        }
      }
    }, 500, true)

    // 点击复制
    const onCopy = debounceMerge(function () {
      toClipboard(state.endResult).then(res => {
        ElMessage({
          message: '已将内容复制到剪切板',
          type: 'success'
        })
      })
      console.log(1)
    }, 500, true)
    // 登录
    const submitForm = function () {
      if (state.appid.length > 0 && state.secret.length > 0) {
        const data = JSON.stringify({
          appid: state.appid,
          secret: state.secret
        })
        localStorage.setItem('token', data)
        ElMessage({
          message: '填写成功，已保存到本地缓冲中',
          type: 'success'
        })
        state.isLoginedVisible = !state.isLoginedVisible
        state.token = true
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
    // 判断页面的状态
    const judgeWidth = function () {
      const W = document.body.offsetWidth
      if (W <= 440) {
        state.PageWidth = '80%'
      } else if (W > 440 && W < 900) {
        state.PageWidth = '70%'
      } else {
        state.PageWidth = '30%'
      }
      console.log(W)
    }
    // 退出登录
    const LayOut = function () {
      localStorage.clear()
      const token = localStorage.getItem('token')
      if (!token) {
        state.appid = ''
        state.secret = ''
        state.token = ''
        state.isLoginedVisible = true
        ElMessage({
          message: '您已退出,本地缓冲信息已清除',
          type: 'success'
        })
      }
    }
    const remindClick = function () {
      state.drawerT = true
      // location.href = 'https://api.fanyi.baidu.com/api/trans/product/apichoose'
    }
    onMounted(() => {
      const token = localStorage.getItem('token')
      console.log(token)
      if (token) {
        const a = JSON.parse(token)
        state.appid = a.appid
        state.secret = a.secret
        state.isLoginedVisible = false
        state.token = true
        ElNotification({
          title: '提示',
          position: 'bottom-right',
          message: '已登录请放心使用,如有问题联系下方管理员',
          type: 'success'
        })
      } else {
        state.isLoginedVisible = true
      }
      judgeWidth()
      window.addEventListener('resize', debounceMerge(judgeWidth, 300, true))
    })
    onUnmounted(() => {
      window.removeEventListener('resize', debounceMerge(judgeWidth, 300, true))
    })
    return {
      ...toRefs(state),
      createApiParams,
      translate,
      remindClick,
      submitForm,
      queen,
      judgeWidth,
      onCopy,
      closeCon,
      starSwitch,
      LayOut
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
.home-wrap {
  width: 100%;
  height: 100%;
}

.el-drawer-w {
  text-align: left;
  h6 {
    font-weight: 550;
  }
  .content-left {
    display: block;
    margin: 30px 0;
    line-height: 20px;
  }
}
</style>
