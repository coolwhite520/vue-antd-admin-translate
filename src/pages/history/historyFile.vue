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
    <a-table :scroll="{ x: 1000, y: tableHeight }"
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
            <a @click="() => handleClickDownFile(record, 0)" type="link">{{ record.file_name + record.file_ext }}</a>
          </a-popover>
        </template>
        <template v-else>
          <a-tooltip :title="record.file_name + record.file_ext">
            <a @click="() => handleClickDownFile(record, 0)" type="link">{{ record.file_name + record.file_ext }}</a>
          </a-tooltip>
        </template>
      </template>

      <template slot="lang" slot-scope="text, record">
        <div v-if="record.state !== TranslateStatus.TransNoRun">
          {{ record.src_lang_cn }} -> {{ record.des_lang_cn }}
        </div>
        <div v-else>
          <a-select :value="record.src_lang" style="width: 120px"
                    @change="(value) => { handleChangeSrcLang(value, record) }"
                    size="small"
                    :showSearch="true"
                    :filter-option="filterOption"
          >
            <a-select-option v-for="item in langList" :key="item.en_name">
              {{ item.cn_name }}
            </a-select-option>
          </a-select>
          ->
          <a-select :value="record.des_lang" style="width: 120px"
                    @change="(value) => { handleChangeDesLang(value, record) }"
                    size="small"
                    :showSearch="true"
                    :filter-option="filterOption"
          >
            <a-select-option v-for="item in langList" :key="item.en_name">
              {{ item.cn_name }}
            </a-select-option>
          </a-select>
        </div>
      </template>

      <template slot="progress" slot-scope="text, record">
        <a-progress
            :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
            :percent="record.progress"
        />
      </template>

      <template slot="operation" slot-scope="text, record">
        <div style="text-align: center">
          <template v-if="record.state === TranslateStatus.TransNoRun">
            <a-tooltip title="启动翻译">
              <a-button @click="() => handleClickTranslate(record)" style="margin-right: 20px;" type="primary" size="small">
                <a-icon type="play-circle" />
              </a-button>
            </a-tooltip>
          </template>
          <template v-else-if="record.state === TranslateStatus.TransTranslateFailed">
            <a-tooltip title="再次尝试翻译">
              <a-button @click="() => handleClickTranslate(record)" style="margin-right: 20px;" type="primary" size="small">
                <a-icon type="redo"/>
              </a-button>
            </a-tooltip>
            <a-tooltip title="查看错误信息">
              <a-button @click="() => handleClickDownErrFile(record.error)" style="margin-right: 20px;" type="primary" size="small">
                <a-icon type="search"/>
              </a-button>
            </a-tooltip>
          </template>
          <template v-else-if="record.state >= TranslateStatus.TransTranslateSuccess">
             <a-tooltip title="下载翻译结果">
              <a-button @click="() => handleClickDownFile(record, 2)" style="margin-right: 20px;" type="primary" size="small">
                <a-icon type="download"/>
              </a-button>
             </a-tooltip>
          </template>
          <a-tooltip title="删除此条记录">
            <a-button @click="() => handleClickDelete(record)" type="danger" size="small">
              <a-icon type="delete"/>
            </a-button>
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
  props: ["langList", "hisType", "columns", "tableHeight"],
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
  destroyed() {
    if (this.loop) clearInterval(this.loop)
  },
  methods: {
    findItemById(id, list) {
      for (let item of list) {
        if (item.id === id) {
          return item
        }
      }
      return null
    },
    deleteItemById(id, list) {
      for(let i = list.length - 1; i>=0; i--) {
        let item = list[i];
        if (item.id === id) {
          list.splice(i, 1)
        }
      }
    },
    convert2ChineseLang(en_name) {
      for (let item of this.langList) {
        if (item.en_name === en_name) {
          return item.cn_name;
        }
      }
      return "";
    },
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
    isOverState(state) {
      if (state === TranslateStatus.TransTranslateSuccess ||
          state === TranslateStatus.TransTranslateFailed ){
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
          list = list.map((item) => {
            let src_lang_cn = this.convert2ChineseLang(item.src_lang);
            let des_lang_cn = this.convert2ChineseLang(item.des_lang);
            return {
              ...item,
              out_file_full_name: item.file_name + "." + des_lang_cn + item.out_file_ext,
              src_lang_cn,
              des_lang_cn,
            }
          })
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

          for (let item of list) {
            let obj = this.findItemById(item.id, this.tableData)
            if (obj === null) continue
            item.src_lang = obj.src_lang
            item.des_lang = obj.des_lang
          }
          this.tableData = list
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
    handleClickDownErrFile(errorMsg) {
      this.$message.info(errorMsg);
    },
    async handleClickDownFile(item, type) {
      PostTransDownFile({id: item.id, type})
          .then((res) => {
            let url = window.URL.createObjectURL(res.data);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            if (type === 0) {
              aLink.setAttribute("download", item.file_name + item.file_ext);
            } else {
              aLink.setAttribute("download", item.out_file_full_name);
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
      // if (obj.des_lang === obj.src_lang) {
      //   for (let item of this.langList) {
      //     if (item.en_name !== obj.des_lang) {
      //       obj.des_lang = item.en_name
      //       break;
      //     }
      //   }
      // }
    },
    handleChangeDesLang(lang, obj) {
      obj.des_lang = lang;
      if (obj.src_lang === "") {
        obj.src_lang = lang
      }
      // if (obj.des_lang === obj.src_lang) {
      //   for (let item of this.langList) {
      //     if (item.en_name !== obj.src_lang) {
      //       obj.src_lang = item.en_name
      //       break;
      //     }
      //   }
      // }
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
      item.state = TranslateStatus.TransBeginTranslate
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
