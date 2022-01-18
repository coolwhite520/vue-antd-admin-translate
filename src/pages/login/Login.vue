<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png"/>
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">集神经网络、自然语言识别、图片识别于一身的智能翻译平台</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <!--        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">-->
        <!--          <a-tab-pane tab="账户密码登录" key="1">-->
        <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;"/>
        <a-form-item>
          <a-input
              autocomplete="autocomplete"
              size="large"
              v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
          >
            <a-icon slot="prefix" type="user"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
              size="large"
              autocomplete="autocomplete"
              type="password"
              v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
          >
            <a-icon slot="prefix" type="lock"/>
          </a-input>
        </a-form-item>
        <!--          </a-tab-pane>-->
        <!--          <a-tab-pane tab="手机号登录" key="2">-->
        <!--            <a-form-item>-->
        <!--              <a-input size="large" placeholder="mobile number" >-->
        <!--                <a-icon slot="prefix" type="mobile" />-->
        <!--              </a-input>-->
        <!--            </a-form-item>-->
        <!--            <a-form-item>-->
        <!--              <a-row :gutter="8" style="margin: 0 -4px">-->
        <!--                <a-col :span="16">-->
        <!--                  <a-input size="large" placeholder="captcha">-->
        <!--                    <a-icon slot="prefix" type="mail" />-->
        <!--                  </a-input>-->
        <!--                </a-col>-->
        <!--                <a-col :span="8" style="padding-left: 4px">-->
        <!--                  <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>-->
        <!--                </a-col>-->
        <!--              </a-row>-->
        <!--            </a-form-item>-->
        <!--          </a-tab-pane>-->
        <!--        </a-tabs>-->
        <a-form-item>
          <a-row :gutter=[12,0]>
            <a-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
              <a-input size="large"
                       v-decorator="['idCode', {rules: [{ required: true, message: '请输入验证码'}]}]"
                       placeholder="验证码"
                       :maxLength="4"
              />
            </a-col>
            <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <div class="code" @click="refreshCode">
                <identify :identifyCode="identifyCode"></identify>
              </div>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-button :loading="logging" style="width: 100%;" size="large" htmlType="submit"
                    type="primary">登录
          </a-button>
          <div>
            <!--          <a-checkbox :checked="true">自动登录</a-checkbox>-->
            <a style="float: right" @click="clickForgetPwd">忘记密码?</a>
          </div>
        </a-form-item>
        <!--        <div>-->
        <!--          其他登录方式-->
        <!--          <a-icon class="icon" type="alipay-circle" />-->
        <!--          <a-icon class="icon" type="taobao-circle" />-->
        <!--          <a-icon class="icon" type="weibo-circle" />-->
        <!--          <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>-->
        <!--        </div>div-->
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout"
import {login} from '@/services/user'
import {setAuthorization} from '@/utils/request'
import {mapMutations} from 'vuex'
import Identify from "../identify/identify";


export default {
  name: 'Login',
  components: {Identify, CommonLayout},
  data() {
    return {
      logging: false,
      error: '',
      identifyCodes: '23456789cdef',
      identifyCode: "",
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.refreshCode()
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    // 验证码处理
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },

    // 刷新验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
            ]
      }
    },
    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.loading = true
          const name = this.form.getFieldValue('name')
          const password = this.form.getFieldValue('password')
          const idCode = this.form.getFieldValue('idCode');
          if (idCode !== this.identifyCode) {
            this.$message.error("验证码输入错误，请重新输入。");
            this.refreshCode();
            this.form.setFieldsValue({"idCode":''})
            return;
          }
          login(name, password)
              .then(res => {
                console.log(res)
                if (res.data.code !== 200) {
                  this.$message.warning(res.data.msg);
                  this.loading = false;
                  return;
                }
                this.afterLogin(res, password);
              })
              .catch((err) => {
                this.$message.error(err.message)
                this.loading = false;
              })
        }
      })
    },
    clickForgetPwd() {
      this.$message.warning("请联系管理员为您重新设置密码！")
    },
    afterLogin(res, password) {
      this.logging = false
      if (res.data.code === 200) {
        let list = this.$PasswordValidator(password)
        const {user} = res.data;
        user.pwdValidator = list
        this.setUser(user)
        let tokenObj = {
          token: res.headers['authorization'],
        }
        setAuthorization(tokenObj)
        if (list.length > 0) {
          this.$router.push('/self')
        } else {
          this.$router.push('/translate')
        }
      } else {
        this.$message.error(res.data.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;

    .header {
      height: 44px;
      line-height: 44px;

      a {
        text-decoration: none;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }

      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }

    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
