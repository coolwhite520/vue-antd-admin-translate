<template>
  <div>
    <a-card>
      <!-- 禁止浏览器自动填充密码的隐藏输入框 -->
      <div style="text-align: center;margin-bottom: 10px;color: darkred">
        密码必须包含大、小写字母、数字，并至少包含一个特殊字符且长度不能小于12位。
      </div>
      <a-input type="text" name="hideInput1" style="opacity:0;position:fixed;left:10000px;"></a-input>
      <a-input type="password" name="hideInput2" style="opacity:0;position:fixed;left:10000px;"></a-input>
      <!-- 防止浏览器自动填充密码的隐藏输入框 -->
      <div slot="title">
        <a-icon slot="prefix" type="lock"/>&nbsp;密码修改
      </div>
      <a-row>
        <a-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
          &nbsp;
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">


          <a-input placeholder="请输入原始密码"
                   style="margin-top: 5px;"
                   v-model="old_password"
                   :allowClear="true"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
          </a-input>

          <a-input-search placeholder="请输入新密码"
                   style="margin-top: 5px;"
                   v-model="new_password" @search="handleClickGeneratePwd"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
            <a-button slot="enterButton" type="primary">
                <a-icon type="reddit" />随机密码
            </a-button>
          </a-input-search>

          <a-input placeholder="请再次输入新密码"
                   style="margin-top: 5px;"
                   v-model="second_password"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
          </a-input>
          <a-button type="primary" style="margin-top: 20px;width: 100%" @click="handleClickSubmit">
            提交
          </a-button>
        </a-col>
      </a-row>
      <a-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
        &nbsp;
      </a-col>
    </a-card>
  </div>
</template>

<script>
import {logout, PostModifyPassword} from "../../services/user";
import {mapState} from "vuex";

export default {
  name: "self",
  data() {
    return {
      old_password: "",
      new_password: "",
      second_password: "",
      pwdValidator: [],
    };
  },
  computed: {
    ...mapState('account', { currUser: 'user'})
  },
  mounted() {
    const {pwdValidator} = this.currUser
    console.log(pwdValidator)
    this.pwdValidator = pwdValidator;
  },
  methods: {
    handleClickGeneratePwd() {
      let password = this.$GeneratePwd();
      this.new_password = password
      this.second_password = password;
    },
    handleClickSubmit() {
      let old_password = this.old_password.trim()
      let new_password = this.new_password.trim()
      let second_password = this.second_password.trim()
      if (old_password.length === 0) {
        this.$message.warning("原始密码输入框为空，请重新输入")
        return;
      }
      if (new_password !== second_password) {
        this.$message.warning("两次密码输入不同，请检查！")
        return
      }

      let list = this.$PasswordValidator(new_password)
      if (list.length > 0) {
        let tips = list.map(item => item.message)
        let tipMsg = tips.join("，")
        this.$message.warning(tipMsg + "。")
        return
      }

      let obj = {
        old_password,
        new_password,
        second_password
      }
      PostModifyPassword(obj)
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
            this.$message.success(res.data.msg)
            logout()
            this.$router.push('/login')
          })
          .catch((err) => {
            this.$message.error(err.message)
            return;
          })

    }
  }
}
</script>

<style scoped>

</style>
