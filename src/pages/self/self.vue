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
        <a-col :xs="0" :sm="0" :md="6" :lg="6" :xl="6">
          &nbsp;
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div style="margin-bottom: 10px;color: gray;text-align: center;">常用语言排序的设定会便于您进行翻译操作。</div>
          <a-transfer
              :titles="['所有语言', '常用语言']"
              :data-source="dataSource"
              show-search
              :filter-option="filterOption"
              :target-keys="userFavorLangs"
              :render="item => item.title"
              @change="handleChange"
              :list-style="{
                width: '46%',
                height: '300px',
              }"
          />


          <a-button style="margin-top: 20px;width: 100%" type="primary" @click="handleClickSureFavor">确定</a-button>

        </a-col>
        <a-col :xs="0" :sm="0" :md="6" :lg="6" :xl="6">
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
    ...mapState('account', {currUser: 'user'}),
    dataSource() {
      return this.languageList.map(item => {
        return {
          key: item.en_name,
          title: item.cn_name,
          description: item.cn_name,
        }
      })
    }
  },
  async mounted() {
    try {
      const {pwdValidator} = this.currUser
      this.pwdValidator = pwdValidator;
      await this.fetchSupportLangList()
      await this.fetchUserFavor()
    } catch (e) {
      console.log(e)
    }

  },
  methods: {
    filterOption(inputValue, option) {
      let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (reg.test(inputValue)) {
        let text = option.description;
        let pinYin = this.$Convert2Pinyin(text)
        return pinYin.startsWith(inputValue);
      }
      return option.description.indexOf(inputValue) > -1;
    },
    handleClickSureFavor() {
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
    handleChange(targetKeys, direction, moveKeys) {
      if(direction === 'right') {
        this.userFavorLangs = this.userFavorLangs.concat(moveKeys)
      } else {
        this.userFavorLangs = targetKeys
      }
      console.log(this.userFavorLangs)
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
            this.userFavorLangs = res.data.data.split(",")
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
