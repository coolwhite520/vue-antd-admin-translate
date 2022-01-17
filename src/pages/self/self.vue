<template>
  <div>
    <a-card>
      <div slot="title">
        <a-icon slot="prefix" type="lock"/>&nbsp;密码修改
      </div>
      <!-- 禁止浏览器自动填充密码的隐藏输入框 -->
      <div style="text-align: center;margin-bottom: 10px;color: gray">
        密码必须包含大、小写字母、数字，并至少包含一个特殊字符且长度不能小于12位。
      </div>
      <a-row style="margin-top: 30px;">
        <a-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
          &nbsp;
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <a-input type="text" name="hideInput1" style="opacity:0;position:fixed;left:10000px;"></a-input>
          <a-input type="password" name="hideInput2" style="opacity:0;position:fixed;left:10000px;"></a-input>
          <!-- 防止浏览器自动填充密码的隐藏输入框 -->

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
              <a-icon type="reddit"/>
              随机密码
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
        <a-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
          &nbsp;
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin-top: 20px;">
      <div slot="title">
        <a-icon type="sort-descending"/>&nbsp;常用语言排序
      </div>
      <a-row v-show="languageList.length > 3 && pwdValidator.length === 0 ">
        <a-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
          &nbsp;
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div style="margin-bottom: 10px;color: gray">常用语言序列会显示在翻译页面的滚动菜单上，便于您的操作。[注：只取前三项]</div>
          <a-select
              mode="multiple"
              v-model="userFavorLangs"
              style="width: 100%"
              placeholder="请选择常用语言，此序列只取前三个选项。"
              @change="handleChange"
              :allowClear="true"
              :filter-option="filterOption"
          >
            <a-select-option v-for="item in languageList" :key="item.en_name">
              {{ item.cn_name }}
            </a-select-option>
          </a-select>
          <a-button style="margin-top: 20px;width: 100%" type="primary" @click="handleClickSureFavor">确定</a-button>

        </a-col>
        <a-col :xs="0" :sm="0" :md="8" :lg="8" :xl="8">
          &nbsp;
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import {logout, PostModifyPassword, GetUserFavor, AddUserNewFavor} from "../../services/user";
import {mapState} from "vuex";
import {GetTransLangList} from "../../services/translate";

export default {
  name: "self",
  data() {
    return {
      old_password: "",
      new_password: "",
      second_password: "",
      pwdValidator: [],
      languageList: [],
      userFavorLangs: [],
    };
  },
  computed: {
    ...mapState('account', {currUser: 'user'})
  },
  async mounted() {
    const {pwdValidator} = this.currUser
    this.pwdValidator = pwdValidator;
    await this.fetchSupportLangList()
    await this.fetchUserFavor()
  },
  methods: {
    filterOption(input, option) {
      let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (reg.test(input)) {
        let text = option.componentOptions.children[0].text;
        let pinYin = this.$Convert2Pinyin(text)
        return pinYin.startsWith(input);
      }
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleClickSureFavor() {
      if (this.userFavorLangs.length < 3) {
        this.$message.warning("您选择的项目数量不够三种，请继续添加。")
        return
      }
      AddUserNewFavor(this.userFavorLangs.join(","))
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              return
            }
            this.$message.success(res.data.msg);
            this.$router.push("/translate")
          })
          .catch(err => {
            this.$message.warning(err)
          });
    },
    handleChange(value) {
      this.userFavorLangs = value
    },
    async fetchSupportLangList() {
      return new Promise((resolve, reject) => {
        GetTransLangList()
            .then((res) => {
              if (res.data.code !== 200) {
                this.$message.warning(res.data.msg)
                reject(res.data.msg)
                return
              }
              if (res.data.data.length < 2) {
                this.$message.warning("获取的支持语言列表错误")
                return
              }
              this.languageList = res.data.data;
              resolve("done")
            })
            .catch(err => {
              this.$message.warning(err)
              reject(err)
            });
      });
    },
    async fetchUserFavor() {
      return new Promise((resolve, reject) => {
        GetUserFavor().then((res) => {
          if (res.data.code !== 200) {
            this.$message.warning(res.data.msg)
            reject(res.data.msg)
            return
          }
          if (res.data.data.length > 0) {
            this.userFavorLangs = res.data.data.split(",").slice(0, 3)
          } else {
            this.userFavorLangs = []
          }
          resolve('done')
        }).catch(err => {
          this.$message.warning(err)
          reject(err)
        });
      });
    },

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
