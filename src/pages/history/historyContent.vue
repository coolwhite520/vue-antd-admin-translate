<template>
  <div>
    <a-table :scroll="{ y: 800 }"
             :pagination="false"
             :columns="columnsContent"
             :data-source="tableData"
             rowKey="id" style="margin-top: 20px;"
             size="small">
      <template slot="file_name" slot-scope="text, record">
        <a @click="() => handleClickDownFile(record)" type="link">{{ text }}</a>
      </template>

      <template slot="lang" slot-scope="text, record">
        {{ record.src_lang_cn }} -> {{ record.des_lang_cn }}
      </template>
      <template slot="state_describe" slot-scope="text, record">
        <div v-if="record.state === TranslateStatus.TransTranslateSuccess" style="color: #52c41a;">
          {{ text }}
        </div>
        <div v-else style="color: #f5222f;">
          {{ text }}&nbsp;{{ record.error }}
        </div>
      </template>

      <template slot="operation" slot-scope="text, record">
        <div style="text-align: center">
          <a-tooltip title="复制这条记录">
            <a @click="() => handleClickCopy(record)">
              <a-icon type="copy"/>
            </a>
          </a-tooltip>
          <a-tooltip title="删除此条记录">
            <a @click="() => handleClickDelete(record)" style="margin-left: 20px;">
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
import {GetRecordsByType, PostDeleteRecord, PostTransDownFile} from "../../services/translate";
import TranslateStatus from "../../utils/translateStatus";

const columnsContent = [
  {
    title: '时间',
    dataIndex: 'create_at',
    scopedSlots: {customRender: 'create_at'},
    align: 'center'
  },
  {
    title: '文本',
    dataIndex: 'content',
    scopedSlots: {customRender: 'content'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '翻译结果',
    dataIndex: 'output_content',
    scopedSlots: {customRender: 'output_content'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '语言',
    dataIndex: 'lang',
    scopedSlots: {customRender: 'lang'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center'
  },
]

export default {
  name: "historyContent",
  props: ["langList"],
  data() {
    return {
      TranslateStatus,
      columnsContent,
      loading: false,
      tableData: [],
      pageSizeOptions: ['10', '20', '30', '40', '500'],
      current: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    convert2ChineseLang(en_name) {
      for (let item of this.langList) {
        if(item.en_name === en_name) {
          return item.cn_name;
        }
      }
      return "";
    },
    fetchTableData() {
      GetRecordsByType(0, (this.current - 1) * this.pageSize, this.pageSize).then(res => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          return;
        }
        let {list, total} = res.data.data
        if (list !== null) {
          this.tableData = list.map((item) => {
            let src_lang_cn = this.convert2ChineseLang(item.src_lang);
            let des_lang_cn = this.convert2ChineseLang(item.des_lang);
            return {
              ...item,
              src_lang_cn,
              des_lang_cn,
            }
          })
        } else {
          this.tableData = []
        }
        this.total = total
      }).catch((err) => {
        this.$message.error(err.message)
      })
    },
    onChangePage() {
      this.fetchTableData()
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.fetchTableData()
    },
    handleClickCopy(item) {
      let content = `开始时间:${item.create_at} \r\n
语言:${item.src_lang_cn} -> ${item.des_lang_cn}\r\n
文本：${item.content} \r\n
翻译结果：${item.output_content}
`
      this.$copy(content)
      this.$message.success("已经复制到剪贴板")
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
            let blob = new Blob([res.data]);
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
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
  }
}
</script>

<style scoped>

</style>
