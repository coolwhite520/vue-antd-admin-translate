<template>
  <div>
    <a-row :gutter=[12,12]>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card style="text-align:center;">
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
          <a-button
              type="primary"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-top: 16px;width: 40%"
              @click="handleUpload"
          >
            {{ uploading ? '上传中' : '开始上传' }}
          </a-button>

          <a-table :scroll="{ y: 400 }"
                   v-show="this.tableData.length>0"
                   :columns="columns"
                   :data-source="tableData"
                   rowKey="id" style="margin-top: 20px;"
                   size="small">
            <template slot="file_name" slot-scope="text, record">
              <template v-if="record.trans_type === 1">
                <a-popover>
                  <template slot="content">
                    <pic-preview :id="record.id"/>
                  </template>
                  <a @click="() => handleClickDownFile(record, 0)" type="link">{{ text }}</a>
                </a-popover>
              </template>
              <template v-else>
                <a @click="() => handleClickDownFile(record, 0)" type="link">{{ text }}</a>
              </template>
            </template>

            <template slot="src_lang" slot-scope="text, record">
              <a-select :value="record.src_lang" style="width: 120px"
                        @change="(value) => { handleChangeSrcLang(value, record) }"
                        :showSearch="true"
                        :filter-option="filterOption"
              >
                <a-select-option v-for="item in langList" :key="item.en_name">
                  {{ item.cn_name }}
                </a-select-option>
              </a-select>
            </template>

            <template slot="des_lang" slot-scope="text, record">
              <a-select :value="record.des_lang" style="width: 120px"
                        @change="(value) => { handleChangeDesLang(value, record) }"
                        :showSearch="true"
                        :filter-option="filterOption"
              >
                <a-select-option v-for="item in langList" :key="item.en_name">
                  {{ item.cn_name }}
                </a-select-option>
              </a-select>
            </template>

            <template slot="operation" slot-scope="text, record">
              <div style="text-align: center">
                <a-button @click="() => handleClickTranslate(record)" type="primary">翻译</a-button>
                <a-tooltip title="删除此条记录">
                  <a @click="() => handleClickDelete(record)" style="margin-left: 20px;">
                    <a-icon type="delete"/>
                  </a>
                </a-tooltip>

              </div>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>

import PicPreview from "../history/picPreview";
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


import {PostDeleteRecord, PostTransDownFile, PostTransFile, PostTransUpload} from "../../services/translate";

export default {
  name: "TranslateFile",
  components: {PicPreview},
  props: ["langList"],
  data() {
    return {
      fileList: [],
      uploading: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      tableData: [],
      columns,
    }
  },
  methods: {
    filterOption(input, option) {
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
    handleClickDownFile(item) {
      let obj = {
        id: item.id,
        type: 0
      }
      PostTransDownFile(obj)
      .then((res) => {
        var blob = new Blob([res.data]);
        var url = window.URL.createObjectURL(blob);
        var aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", item.file_name);
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      })
      .catch((err) => {
        this.$message.error(err.message);
      })
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
      .catch((err)=>{
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
