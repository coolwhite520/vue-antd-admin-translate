<template>
  <div>
    <a-row :gutter=[12,12]>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-textarea
            ref="inputText"
            :auto-size="{ minRows: 10, maxRows: 20 }"
            :allowClear="true"
            v-model="content"
            size="large"
            :maxLength="maxLength"
            :placeholder="placeholder"
            @change="onChangeContent"
        />

      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-textarea
            :auto-size="{ minRows: 10, maxRows: 20 }"
            :allowClear="true"
            v-model="outContent"
            size="large"
            :disabled="true"
        />
        <div style="text-align: right;margin-top: 10px;">
          <a-button  @click="handleClickEmpty"><a-icon type="delete" />&nbsp;Clear</a-button>
          &nbsp;
          <a-button  @click="handleClickCopy"><a-icon type="copy" />&nbsp;Copy</a-button>
          &nbsp;
          <a-button type="primary" @click="handleClickTransContent" :loading="loading">
            <a-icon type="cloud" />&nbsp;翻译
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>


<script>
import {PostTransContent} from "../../services/translate";

export default {
  name: 'TranslateContent',
  i18n: require('./i18n'),
  props: ["srcLang", "desLang"],
  data() {
    return {
      content: "",
      outContent: "",
      loading: false,
      maxLength: 2000,
    }
  },
  computed: {
    placeholder() {
      return `最大支持${this.maxLength}个字符`
    }
  },
  created() {

  },
  mounted() {
    this.$refs.inputText.focus();
  },
  methods: {
    onChangeContent() {
      this.outContent = ""
    },
    handleClickEmpty() {
      this.content = ""
      this.outContent = ""
    },
    handleClickCopy() {
      if (this.outContent === "") {
        this.$message.info("翻译结果文本为空")
        return
      }
      if (window.clipboardData) {
        window.clipboardData.setData('text', this.outContent);
      } else {
        (function(s) {
          document.oncopy = function(e) {
            e.clipboardData.setData('text',  s);
            e.preventDefault();
            document.oncopy = null;
          }
        })(this.outContent);
        document.execCommand('Copy');
      }
      this.$message.success("成功复制到剪贴板")
    },
    handleClickTransContent() {
      this.content = this.content.trim()
      if (this.content === "") {
        this.$message.info("翻译输入框内容为空，请输入内容或粘贴内容")
        this.$refs.inputText.focus();
        return
      }
      this.loading = true
      let obj = {
        src_lang: this.srcLang,
        des_lang: this.desLang,
        content: this.content,
      }
      PostTransContent(obj)
          .then( res => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
          this.loading = false
          return
        }
        this.outContent = res.data.data
        this.loading = false
      }).catch(err => {
        this.$message.warning(err.message)
      })
    }
  }
}
</script>

