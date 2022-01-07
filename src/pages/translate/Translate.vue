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
            <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
              <a-tabs :activeKey="srcLang" @change="onChangeSrcLanguage">
                <template v-for="item of srcLanguageList">
                  <a-tab-pane :key="item.en_name" :tab="item.cn_name">
                  </a-tab-pane>
                </template>
                <template v-if="languageList.length > 3" slot="tabBarExtraContent">
                  <a-button shape="circle" :icon="!showSrcLangTable?'down':'up'"
                            @click="handleClickSrcLangTbl"/>
                </template>
              </a-tabs>
            </a-col>
<!--            语言转换按钮-->
            <a-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
              <div style="text-align: center;margin-top: 5px;">
                <a-button shape="circle" icon="swap" @click="handleClickSwap"/>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
              <a-tabs :activeKey="desLang" @change="onChangeDesLanguage">
                <template v-for="item of desLanguageList">
                  <a-tab-pane :key="item.en_name" :tab="item.cn_name">
                  </a-tab-pane>
                </template>
                <template v-if="languageList.length > 3" slot="tabBarExtraContent">
                  <a-button shape="circle" :icon="!showDesLangTable?'down':'up'"
                            @click="handleClickDesLangTbl"/>
                </template>
              </a-tabs>
            </a-col>
          </a-row>
          <template>
            <!--          根据radioType进行判断-->
            <div v-if="radioType==='text'">
              <template v-if="showSrcLangTable || showDesLangTable">
                <!--            所有的语言列表， 当支持的语言比较多的时候，大于3个的时候-->
                <a-input placeholder="搜索语言" size="large" v-model="searchInputValue" @change="onChangeInput" :allowClear="true"/>
                <div style="overflow: auto; height: 400px; margin-left: 5px;margin-top: 5px;">
                  <div v-for="item of groupByCharLangList" :key="item.key" style="margin-bottom: 10px;">
                    <div style="color: #9c9c9c">
                      {{ item.key.toUpperCase() }}
                    </div>
                    <div style="margin-top: 2px;">
                      <a-button v-for="obj of item.list"
                                :key="obj.en_name"
                                @click="handleClickTag(obj)"
                                style="margin-right: 5px;margin-top: 3px;"
                                :type="obj.isSupport?'default':'dashed'"
                                :disabled="!obj.isSupport"
                      >
                        {{ obj.cn_name }}
                      </a-button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <translate-content :srcLang="srcLang" :desLang="desLang"/>
              </template>
            </div>
            <div v-else-if="radioType==='file'">
              <translate-file :langList="languageList"/>
            </div>
            <div v-else-if="radioType==='history'">
              <history :langList="languageList"/>
            </div>
          </template>
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
import {GetAllLangList, GetTransLangList} from "../../services/translate";
import TranslateContent from "./TranslateContent";
import TranslateFile from "./TranslateFile";
import History from "../history/history";

// const PopularLangList = [
//   "Chinese",
//   "English",
//   "Spanish",
//   "French",
//   "Arabic",
//   "Russian",
//   "Portuguese",
//   "Japanese",
//   "German",
// ];

import {pinyin} from 'pinyin-pro';

const _ = require("lodash");

export default {
  name: 'WorkPlace',
  components: {History, TranslateFile, TranslateContent},
  i18n: require('./i18n'),
  data() {
    return {
      searchInputValue: "",
      loading: false,
      radioType: "text",
      languageList: [],     // 所有支持的语言
      allLanguageList: [],     // 所有语言
      srcLanguageList: [],  // 源语言显示在tabs（默认3个语言）
      desLanguageList: [], // 源语言显示在tabs（默认3个语言）
      groupByCharLangList: [], // 分组后的语言列表
      srcLang: "",
      desLang: "",
      isServerException: false,
      showSrcLangTable: false,
      showDesLangTable: false,
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
  },
  async created() {
    await this.fetchSupportLangList();
    await this.fetchAllLangList();
    this.groupByCharLangList = this.makeLangListGroupBy(this.allLanguageList)
    if (this.languageList.length > 3) {
      this.srcLanguageList = this.languageList.slice(0,3)
      this.desLanguageList = this.languageList.slice(0,3)
    } else {
      this.srcLanguageList = this.languageList
      this.desLanguageList = this.languageList
    }
    this.srcLang = this.srcLanguageList[0].en_name
    this.desLang = this.desLanguageList[1].en_name
  },
  mounted() {

  },
  methods: {
    handleClickSwap() {
      let srcTemp = this.srcLang
      if (this.isInLangList(this.desLang, this.srcLanguageList)) {
        this.srcLang = this.desLang;
      } else {
        let obj = this.languageList.filter((item) => item.en_name === this.desLang)[0]
        this.srcLanguageList.splice(this.srcLanguageList.length-1, 1)
        this.srcLanguageList.unshift(obj)
        this.srcLang = this.srcLanguageList[0].en_name;
      }

      if (this.isInLangList(srcTemp, this.desLanguageList)) {
        this.desLang = srcTemp;
      } else {
        let obj = this.languageList.filter((item) => item.en_name === srcTemp)[0]
        this.desLanguageList.splice(this.desLanguageList.length-1, 1)
        this.desLanguageList.unshift(obj)
        this.desLang = this.desLanguageList[0].en_name
      }
      this.$bus.$emit("swapLang")
    },
    handleClickSrcLangTbl() {
      this.searchInputValue = ""
      if (this.showDesLangTable) {
        this.showDesLangTable = false;
        return;
      }
      this.groupByCharLangList = this.makeLangListGroupBy(this.allLanguageList)
      this.showSrcLangTable = !this.showSrcLangTable
    },
    handleClickDesLangTbl() {
      this.searchInputValue = ""
      if (this.showSrcLangTable) {
        this.showSrcLangTable = false;
        return;
      }
      this.groupByCharLangList = this.makeLangListGroupBy(this.allLanguageList)
      this.showDesLangTable = !this.showDesLangTable
    },
    isInLangList(lang, list) {
      for (let item of list) {
        if (item.en_name === lang) {
          return true
        }
      }
      return false
    },

    findIndexList(lang, list) {
      for (let i=0;i<list.length;i++) {
        if (lang === list[i].en_name) {
          return i;
        }
      }
      return -1;
    },
    async fetchAllLangList() {
      return new Promise((resolve, reject) => {
        GetAllLangList()
            .then((res) => {
              if (res.data.code !== 200) {
                this.$message.warning(res.data.msg)
                reject(res.data.msg)
                return;
              }
              this.allLanguageList = res.data.data;
              resolve("done")
            })
            .catch((err) => {
              this.$message.warning(err)
              reject(err)
            })
      })
    },
    async fetchSupportLangList() {
      return new Promise((resolve, reject) => {
        GetTransLangList().then((res) => {
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
        }).catch(err => {
          this.$message.warning(err)
          reject(err)
        });
      });
    },
    // 给语言分组
    makeLangListGroupBy(list) {
      let tempList = list.map((item) => {
        let py_name = pinyin(item.cn_name, {toneType: 'none'});
        let isSupport = this.isInLangList(item.en_name, this.languageList)
        return {
          ...item,
          py_name,
          first_char: py_name.charAt(0),
          isSupport
        }
      })
      tempList = _.sortBy(tempList, function (item) {
        return item.py_name
      })
      let groupObj = _.groupBy(tempList, 'first_char')
      let groupList = []
      for (let key of Object.keys(groupObj)) {
        groupList.push({
          key,
          list: groupObj[key]
        })
      }
      return groupList;
    },

    handleClickTag(obj) {
      if (this.showSrcLangTable) {
        let index = this.findIndexList(obj.en_name, this.srcLanguageList)
        if (index !== -1) {
          let obj = this.srcLanguageList[index]
          this.srcLanguageList.splice(index, 1)
          this.srcLanguageList.unshift(obj)
        } else {
          this.srcLanguageList.splice(this.srcLanguageList.length-1, 1)
          this.srcLanguageList.unshift({
            en_name: obj.en_name,
            cn_name: obj.cn_name
          })
        }
        this.srcLang = this.srcLanguageList[0].en_name;
        this.onChangeSrcLanguage(this.srcLang)
        this.showSrcLangTable = false;
      } else {
        let index = this.findIndexList(obj.en_name, this.desLanguageList)
        if (index !== -1) {
          let obj = this.desLanguageList[index]
          this.desLanguageList.splice(index, 1)
          this.desLanguageList.unshift(obj)
        } else {
          this.desLanguageList.splice(this.desLanguageList.length-1, 1)
          this.desLanguageList.unshift({
            en_name: obj.en_name,
            cn_name: obj.cn_name
          })
        }
        this.desLang = this.desLanguageList[0].en_name;
        this.onChangeDesLanguage(this.desLang)
        this.showDesLangTable = false;
      }
    },
    onChangeInput() {
      let curList = this.allLanguageList.filter((item) => {
        return item.cn_name.indexOf(this.searchInputValue) !== -1
      })
      this.groupByCharLangList = this.makeLangListGroupBy(curList)
    },

    handleChangeRadio(e) {
      this.radioType = e.target.value;
      this.showSrcLangTable = false
      this.showDesLangTable = false
    },
    onChangeSrcLanguage(activeKey) {
      this.showSrcLangTable = false
      this.srcLang = activeKey
      if (this.srcLang === this.desLang) {
        for (let item of this.desLanguageList) {
          if (item.en_name !== this.srcLang) {
            this.desLang = item.en_name
            break;
          }
        }
      }
    },
    onChangeDesLanguage(activeKey) {
      this.showDesLangTable = false
      this.desLang = activeKey
      if (this.srcLang === this.desLang) {
        for (let item of this.srcLanguageList) {
          if (item.en_name !== this.desLang) {
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
