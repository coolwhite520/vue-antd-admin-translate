<template>
  <div>
    <div style="text-align: right;margin-right: 10px;">
      <a-checkbox :defaultChecked="false" :checked="autoFresh" @change="onChangeAutoFresh">
        自动刷新
      </a-checkbox>
      <a-tooltip title="点击刷新">
        <a-icon type="sync" :spin="loading" @click="handleClickFresh"/>
      </a-tooltip>
    </div>
    <a-table :scroll="{ x: 1200, y: 300 }"
             :pagination="false"
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

      <template slot="file_content" slot-scope="text, record">
        <div v-if="record.state >= TranslateStatus.TransExtractSuccess">
          <a @click="() => handleClickDownFile(record, 1)" type="link">下载</a>
        </div>
      </template>

      <!--      <template  slot="error" slot-scope="text, record">-->
      <!--        <p  v-if="record.error.length > 0" slot="expandedRowRender" style="margin: 0">-->
      <!--          {{ record.error }}-->
      <!--        </p>-->
      <!--      </template>-->

      <template slot="lang" slot-scope="text, record">
        <div v-if="record.state !== TranslateStatus.TransNoRun">
          {{ record.src_lang }} -> {{ record.des_lang }}
        </div>
        <div v-else>
          <a-select :value="record.src_lang" style="width: 120px"
                    @change="(value) => { handleChangeSrcLang(value, record) }" size="small">
            <a-select-option v-for="item in langList" :key="item.en_name">
              {{ item.cn_name }}
            </a-select-option>
          </a-select>
          ->
          <a-select :value="record.des_lang" style="width: 120px"
                    @change="(value) => { handleChangeDesLang(value, record) }" size="small">
            <a-select-option v-for="item in langList" :key="item.en_name">
              {{ item.cn_name }}
            </a-select-option>
          </a-select>
        </div>
      </template>

      <template slot="state_describe" slot-scope="text, record">
        <div
            v-if="record.state === TranslateStatus.TransTranslateSuccess || record.state === TranslateStatus.TransExtractSuccessContentEmpty"
            style="color: #52c41a;">
          {{ text }}
        </div>
        <div
            v-else-if="record.state === TranslateStatus.TransTranslateFailed || record.state === TranslateStatus.TransExtractFailed"
            style="color: #f5222f;">
          {{ text }}
        </div>
        <div v-else style="color: #faad14;">
          {{ text }}
        </div>
      </template>

      <template slot="file_trans" slot-scope="text, record">
        <div v-if="record.state >= TranslateStatus.TransTranslateSuccess">
          <a @click="() => handleClickDownFile(record, 2)" type="link">下载</a>
        </div>
      </template>

      <template slot="operation" slot-scope="text, record">
        <div style="text-align: center">
          <template v-if="record.state === TranslateStatus.TransNoRun">
            <a-tooltip title="翻译">
              <a @click="() => handleClickTranslate(record)" style="margin-right: 20px;">
                <a-icon type="cloud"/>
              </a>
            </a-tooltip>
          </template>
          <template
              v-if="record.state === TranslateStatus.TransExtractFailed || record.state === TranslateStatus.TransTranslateFailed">
            <a-tooltip title="再次尝试翻译">
              <a @click="() => handleClickTranslate(record)" style="margin-right: 20px;">
                <a-icon type="redo"/>
              </a>
            </a-tooltip>
            <a-popover title="失败信息">
              <template slot="content">
                <p>{{ record.error }}</p>
              </template>
              <a-icon type="search" style="color: #f5222f;margin-right: 20px;"/>
            </a-popover>
          </template>
          <a-tooltip title="删除此条记录">
            <a @click="() => handleClickDelete(record)">
              <a-icon type="delete"/>
            </a>
          </a-tooltip>

        </div>
      </template>
    </a-table>
    <div v-if="total > 0" style="text-align: right;margin-top: 10px;">
      <a-pagination
          v-model="current"
          :page-size-options="pageSizeOptions"
          :total="total"
          show-size-changer
          :page-size="pageSize"
          @showSizeChange="onShowSizeChange"
          @change="onChangePage"
          size="small"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-if="props.value === '50'">全部</span>
        </template>
      </a-pagination>
    </div>


  </div>
</template>

<script>
import {GetRecordsByType, PostDeleteRecord, PostTransDownFile, PostTransFile} from "../../services/translate";
import TranslateStatus from "../../utils/translateStatus";
import PicPreview from "./picPreview";


export default {
  name: "historyFile",
  components: {PicPreview},
  props: ["langList", "hisType", "columns"],
  data() {
    return {
      TranslateStatus,
      tableData: [],
      loading: false,
      autoFresh: false,
      isManualClickAutoFresh: false,
      loop: null,
      pageSizeOptions: ['10', '20', '30', '40', '500'],
      current: 1,
      pageSize: 10,
      total: 0,
    }
  },
  watch: {
    autoFresh(val) {
      if (val) {
        this.loop = setInterval(() => {
          this.handleClickFresh();
        }, 2000)
      } else {
        clearInterval(this.loop)
      }
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    isOverState(state) {
      if (state === TranslateStatus.TransTranslateSuccess ||
          state === TranslateStatus.TransTranslateFailed ||
          state === TranslateStatus.TransExtractFailed) {
        return true
      }
      return false
    },
    fetchTableData() {
      GetRecordsByType(this.hisType, (this.current - 1) * this.pageSize, this.pageSize).then(res => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          this.autoFresh = false
          clearInterval(this.loop)
          return;
        }
        let {list, total} = res.data.data
        if (list !== null) {
          this.tableData = list
          // 如果不是人为开启的自动刷新，那么就判断一下，是否应该停止了
          if (!this.isManualClickAutoFresh) {
            let isAllOver = true
            for (let item of list) {
              if (!this.isOverState(item.state)) {
                isAllOver = false
                break
              }
            }
            if (isAllOver) this.autoFresh = false
          }
        } else {
          this.tableData = []
        }
        this.total = total
      }).catch((err) => {
        this.$message.error(err.message)
        this.autoFresh = false
        clearInterval(this.loop)
      })
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.fetchTableData()
    },
    onChangePage() {
      this.fetchTableData()
    },
    onChangeAutoFresh(e) {
      this.autoFresh = e.target.checked
      this.isManualClickAutoFresh = true;
    },
    handleClickFresh() {
      this.loading = true
      setTimeout(() => {
        this.fetchTableData()
        this.loading = false
      }, 1500)
    },
    handleClickDelete(item) {
      PostDeleteRecord({record_id: item.id}).then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          return;
        }
        this.fetchTableData();
      })
          .catch((err) => {
            this.$message.error(err.message);
            return;
          })

    },

    async handleClickDownFile(item, type) {
      PostTransDownFile({id: item.id, type})
          .then((res) => {
            var blob = new Blob([res.data]);
            var url = window.URL.createObjectURL(blob);
            var aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            if (type === 0) {
              aLink.setAttribute("download", item.file_name);
            } else {
              aLink.setAttribute("download", item.file_name + ".txt");
            }
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          })
          .catch((err) => {
            this.$message.error(err.message);
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
    },
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
      item.state = TranslateStatus.TransBeginExtract
      item.state_describe = "正在抽取文件内容"
      this.autoFresh = true
      this.isManualClickAutoFresh = false
      PostTransFile(obj)
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
          })
          .catch((err) => {
            this.$message.error(err.message)
            this.autoFresh = false
          })
    },
  }
}
</script>

<style scoped>

</style>
