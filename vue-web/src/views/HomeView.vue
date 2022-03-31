<!--
 * @Author: Harry
 * @Date: 2022-03-30 18:40:11
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-03-31 15:04:51
 * @FilePath: \vue-web\src\views\HomeView.vue
-->
<template>
  <div class="input-wrap">
    <el-input v-model="inputWord" :rows="7" type="textarea" placeholder="Please input" />
    <el-input v-model="endResult" :rows="7" type="textarea" placeholder disabled />
  </div>
  <el-button @click="starSwitch">开始翻译</el-button>
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
      <div class="btn-wrap">
        <el-button color="#626aef" style="color: white">登录</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, defineAsyncComponent } from 'vue'
import md5 from 'js-md5'
import { Jsonp } from '@/http'
import { UserFilled, Key } from '@element-plus/icons-vue'
import NProgress from 'nprogress'
const RemindView = defineAsyncComponent(() => import('@/views/RemindView.vue'))
export default {
  components: {
    RemindView, UserFilled, Key
  },
  setup() {
    const state = reactive({
      isLoginedVisible: true,
      lwTitle: '论文降重小工具',
      appid: '',
      secret: '',
      inputWord: '论文降重小工具',
      tabRouter: 'free',
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
      mode: 'simple'
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
    const starSwitch = function () {
      NProgress.start()
      queen(state.inputWord)
    }

    return {
      ...toRefs(state),
      createApiParams,
      translate,
      queen,
      starSwitch
    }
  }
}
</script>

<style lang="less" scoped>
// 密码输入框
.appid-input,
.secret-input {
  margin: 40px 20px;
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
