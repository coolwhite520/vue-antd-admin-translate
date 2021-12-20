<template>
  <div>
    <a-card>
      <!-- 禁止浏览器自动填充密码的隐藏输入框 -->
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

          <a-input placeholder="请输入新密码"
                   style="margin-top: 5px;"
                   v-model="new_password"
                   :allowClear="true"
                   type="password"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
          </a-input>

          <a-input placeholder="请再次输入新密码"
                   style="margin-top: 5px;"
                   v-model="second_password"
                   :allowClear="true"
                   type="password"
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

export default {
  name: "self",
  data() {
    return {
      old_password: "",
      new_password: "",
      second_password: "",
    };
  },
  methods: {
    handleClickSubmit() {
      let old_password = this.old_password.trim()
      let new_password = this.new_password.trim()
      let second_password = this.second_password.trim()

      if (old_password === 0) {
        this.$message.warning("原始密码输入框为空，请重新输入")
        return;
      }
      if (new_password.length < 5) {
        this.$message.warning("新密码必须大于4位")
        return
      }
      if (new_password !== second_password) {
        this.$message.warning("两次密码输入不同，请检查！")
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
