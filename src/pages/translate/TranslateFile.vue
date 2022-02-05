<template>
  <div>
    <a-card style="text-align: center">
      <a-upload-dragger
          :multiple="true"
          :show-upload-list="true"
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          listType="text"
          @change="handleChange"
      >
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <p class="ant-upload-drag-icon">
              <a-icon type="file-text"/>
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
          </a-col>
        </a-row>
      </a-upload-dragger>
      <div style="text-align: center">
        <a-button
            type="primary"
            :disabled="fileList.length === 0"
            :loading="uploading"
            style="margin-top: 16px;width: 40%"
            @click="handleUpload"
        >
          {{ uploading ? '上传中' : '开始上传' }}
        </a-button>
      </div>

    </a-card>

    <a-card style="margin-top: 20px;">
      <history-file :langList="langList" :hisType="3" :columns="columnsAllFile" :tableHeight="200" ref="historyChild"/>
    </a-card>
  </div>
</template>
<script>

// import PicPreview from "../history/picPreview";


const columnsAllFile = [
  {
    title: '时间',
    dataIndex: 'create_at',
    ellipsis: true,
    align: 'center',
    width: 200,
    fixed: 'left'
  },
  {
    title: '文件类型',
    dataIndex: 'trans_type',
    scopedSlots: {customRender: 'trans_type'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '原始文件',
    dataIndex: 'file_name',
    scopedSlots: {customRender: 'file_name'},
    ellipsis: true,
    align: 'center'
  },

  // {
  //   title: '识别内容',
  //   dataIndex: 'file_content',
  //   scopedSlots: {customRender: 'file_content'},
  //   ellipsis: true,
  //   align: 'center'
  // },
  {
    title: '语言',
    dataIndex: 'lang',
    scopedSlots: {customRender: 'lang'},
    ellipsis: true,
    width: 300,
    align: 'center',
  },
  {
    title: '翻译结果',
    dataIndex: 'file_trans',
    scopedSlots: {customRender: 'file_trans'},
    align: 'center',
    ellipsis: true,
  },
  {
    title: '翻译进度',
    dataIndex: 'state_describe',
    scopedSlots: {customRender: 'state_describe'},
    align: 'center',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center',
    width: 100,
    fixed: 'right',
  },
];


const columns = [
  {
    title: '文件名',
    dataIndex: 'file_name',
    scopedSlots: {customRender: 'file_name'},
    align: 'center'
  },
  {
    title: '源语言',
    dataIndex: 'src_lang',
    scopedSlots: {customRender: 'src_lang'},
    align: 'center'
  },
  {
    title: '目标语言',
    dataIndex: 'des_lang',
    scopedSlots: {customRender: 'des_lang'},
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center'
  },
];


import {PostDeleteRecord, PostTransFile, PostTransUpload} from "../../services/translate";
import HistoryFile from "../history/historyFile";

export default {
  name: "TranslateFile",
  components: {HistoryFile},
  props: ["langList"],
  data() {
    return {
      columns,
      columnsAllFile,
      fileList: [],
      uploading: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      tableData: [],

    }
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
    handleChange(info) {
      console.log(info)
    },
    handleRemove(file) {
      console.log("remove")
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      console.log("beforeUpload:", file)
      if (file.size === 0) {
        this.$message.warning(`${file.name} 为空文件，无法上传！`)
        return false
      }
      if (file.size > 1024 * 1024 * 5) {
        this.$message.warning(`${file.name} 大于5Mb，请上传小于5Mb的文件！`)
        return false
      }
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleClickDelete(item) {
      PostDeleteRecord({record_id: item.id}).then((res) => {
        console.log(res)
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          return;
        }
        const index = this.tableData.indexOf(item);
        const newFileList = this.tableData.slice();
        newFileList.splice(index, 1);
        this.tableData = newFileList;
      })
          .catch((err) => {
            this.$message.error(err.message);
            return;
          })
    },
    // 翻译
    handleClickTranslate(item) {
      if (item.src_lang === "") {
        this.$message.warning("源语言没有选择，请选择！")
        return
      }
      if (item.des_lang === "") {
        this.$message.warning("目标语言没有选择，请选择！")
        return
      }
      let obj = {
        src_lang: item.src_lang,
        des_lang: item.des_lang,
        record_id: item.id,
      }
      PostTransFile(obj)
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
            this.$notification.success(
                {
                  message: '翻译任务成功添加',
                  description: '可在【历史记录】中查看翻译进度',
                }
            )
            const index = this.tableData.indexOf(item);
            const newFileList = this.tableData.slice();
            newFileList.splice(index, 1);
            this.tableData = newFileList;
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
    },
    //上传
    handleUpload() {
      const {fileList} = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('file', file);
      });
      this.uploading = true;

      PostTransUpload(formData)
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              this.uploading = false;
              return;
            }
            this.tableData = this.tableData.concat(JSON.parse(JSON.stringify(res.data.data)))
            this.fileList = []
            this.uploading = false;
            this.$message.success(res.data.msg);
            this.$refs.historyChild.fetchTableData();
          })
          .catch((err) => {
            this.$message.error(err.message)
            this.uploading = false;
            return;
          })
    },
    handleChangeSrcLang(lang, obj) {
      obj.src_lang = lang
      if (obj.des_lang === "") {
        obj.des_lang = lang
      }
      if (obj.des_lang === obj.src_lang) {
        for (let item of this.langList) {
          if (item.en_name !== obj.des_lang) {
            obj.des_lang = item.en_name
            break;
          }
        }
      }
    },
    handleChangeDesLang(lang, obj) {
      obj.des_lang = lang;
      if (obj.src_lang === "") {
        obj.src_lang = lang
      }
      if (obj.des_lang === obj.src_lang) {
        for (let item of this.langList) {
          if (item.en_name !== obj.src_lang) {
            obj.src_lang = item.en_name
            break;
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
