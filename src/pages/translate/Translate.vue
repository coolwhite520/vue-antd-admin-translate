<template>
  <div>
    <a-row>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
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
          <a-row :gutter=[12,12]>
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
          <!--          文本翻译窗口-->
          <template v-if="radioType==='text'">
            <a-row :gutter=[12,12]>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-textarea
                    placeholder="Autosize height with minimum and maximum number of lines"
                    :auto-size="{ minRows: 10, maxRows: 20 }"
                    :allowClear="true"
                />
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-textarea
                    placeholder="Autosize height with minimum and maximum number of lines"
                    :auto-size="{ minRows: 10, maxRows: 20 }"
                    :allowClear="true"
                />
              </a-col>
            </a-row>
          </template>
          <template v-else-if="radioType==='file'">
            <!--          文件翻译窗口-->
            <a-row :gutter=[12,12]>
              <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <a-card style="text-align:center;">
                  <a-upload-dragger
                      name="file"
                      :multiple="false"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      @change="handleChangeFile"
                  >
                    <p class="ant-upload-drag-icon">
                      <a-icon type="file-text" />
                    </p>
                    <p class="ant-upload-text">
                      点击或拖拽到此区域
                    </p>
                    <p class="ant-upload-hint">
                      文档支持格式：.txt、.doc、.docx、.odf、.pdf、.ppt、.pptx、.ps、.rtf、.xls、.xlsx 等
                    </p>
                    <p class="ant-upload-hint">
                      图片支持格式：.png、.bmp、.jpg、.jpeg、.gif 等
                    </p>
                  </a-upload-dragger>
                </a-card>
              </a-col>
            </a-row>
          </template>

        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'WorkPlace',
  i18n: require('./i18n'),
  data() {
    return {
      radioType: "text",
      languageList: [{
        en_name: "English",
        cn_name: "英语"
      }, {
        en_name: "Chinese",
        cn_name: "中文(简体)"
      }, {
        en_name: "Japanese",
        cn_name: "日语"
      }],
      srcLang: "English",
      desLang: "Chinese",
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {
    request('/user/welcome', METHOD.GET).then(res => this.welcome = res.data)
    request('/work/activity', METHOD.GET).then(res => this.activities = res.data)
    request('/work/team', METHOD.GET).then(res => this.teams = res.data)
    request('/project', METHOD.GET).then(res => {
      this.projects = res.data
      this.loading = false
    })
  },
  mounted() {

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
      console.log(this.srcLang, this.desLang)
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
      console.log(this.srcLang, this.desLang)
    },
    handleChangeFile(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
}
</script>

<style lang="less">
@import "src/pages/translate/index";
</style>
