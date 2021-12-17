<template>
  <div>
    <a-row>
      <a-col :xs="0" :sm="0" :md="3" :lg="3" :xl="3">
        &nbsp;
      </a-col>
      <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <!--          翻译类别-->
        <div>
          <a-radio-group :default-value="radioType" button-style="solid" @change="handleChangeRadio">
            <a-radio-button value="text">
              <a-icon type="font-size"/>&nbsp;文字翻译
            </a-radio-button>
            <a-radio-button value="file">
              <a-icon type="file-text" theme="filled"/>&nbsp;文件翻译
            </a-radio-button>
            <a-radio-button value="history">
              <a-icon type="history"/>&nbsp;历史记录
            </a-radio-button>
          </a-radio-group>
        </div>
        <a-card style="border-radius: 10px;margin-top: 20px;box-shadow:1px 0px 10px 1px #8792a8;">
          <!--         语言列表-->
          <a-row :gutter=[12,12] v-show="radioType==='text'">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-tabs :activeKey="srcLang" @change="onChangeSrcLanguage">
                <template v-for="item of languageList">
                  <a-tab-pane :key="item.en_name" :tab="item.cn_name">
                  </a-tab-pane>
                </template>
              </a-tabs>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-tabs :activeKey="desLang" @change="onChangeDesLanguage">
                <template v-for="item of languageList" >
                  <a-tab-pane :key="item.en_name" :tab="item.cn_name">
                  </a-tab-pane>
                </template>
              </a-tabs>
            </a-col>
          </a-row>
<!--          根据radioType进行判断-->
          <div v-show="radioType==='text'">
            <translate-content :srcLang="srcLang" :desLang="desLang"/>
          </div>
          <div v-show="radioType==='file'">
            <translate-file :langList="languageList"/>
          </div>
          <div v-show="radioType==='history'">

          </div>
        </a-card>
      </a-col>
      <a-col :xs="0" :sm="0" :md="3" :lg="3" :xl="3">
        &nbsp;
      </a-col>
    </a-row>
  </div>
</template>
<script>

import {mapState} from 'vuex'
import {GetTransLangList} from "../../services/translate";
import TranslateContent from "./TranslateContent";
import TranslateFile from "./TranslateFile";



export default {
  name: 'WorkPlace',
  components: {TranslateFile, TranslateContent},
  i18n: require('./i18n'),
  data() {
    return {
      radioType: "text",
      languageList: [],
      srcLang: "",
      desLang: "",
      isServerException: false,
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
  },
  created() {
    GetTransLangList().then((res) => {
      if (res.data.code !== 200) {
        this.$message.warning(res.data.msg)
        return
      }
      this.languageList = res.data.data
      if (this.languageList.length < 2) {
        this.$message.warning("获取的支持语言列表错误")
        return
      }
      this.srcLang = this.languageList[0].en_name;
      this.desLang = this.languageList[1].en_name;
    }).catch( err => {
      this.$message.warning(err)
    });
  },
  methods: {
    handleChangeRadio(e) {
      this.radioType = e.target.value;
      console.log(this.radioType);
    },
    onChangeSrcLanguage(activeKey) {
      this.srcLang = activeKey
      if (this.srcLang === this.desLang) {
        for (let item of this.languageList) {
          if (item.en_name !== this.srcLang){
            this.desLang = item.en_name
            break;
          }
        }
      }
    },
    onChangeDesLanguage(activeKey) {
      this.desLang = activeKey
      if (this.srcLang === this.desLang) {
        for (let item of this.languageList) {
          if (item.en_name !== this.desLang){
            this.srcLang = item.en_name
            break;
          }
        }
      }
    },

  }
}
</script>

<style lang="less">
@import "src/pages/translate/index";
</style>
