<template>
  <div>
    <a-modal v-model="visible" title="内容" ok-text="复制" cancel-text="取消" @ok="copyModal" @cancel="hideModal">
      <div style="height: 100px;overflow-y: auto;">{{modalContent}}</div>
    </a-modal>
    <a-table :pagination="false"
             :columns="columnsContent"
             :data-source="tableData"
             rowKey="id"
             style="margin-top: 20px;"
             :expandIcon="expandIcon"
             :bordered="true"
    >
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <template v-if="record.trans_type === 0">
          <a-row>
            <a-col :span="8">
              <div>源语言：{{record.src_lang_cn}}</div>
            </a-col>
            <a-col :span="8">
              <div>目标语言：{{record.des_lang_cn}}</div>
            </a-col>
            <a-col :span="8">
              <div>&nbsp;</div>
            </a-col>
          </a-row>
          <a-row style="margin-top: 10px;">
            <a-col :span="8">
              <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                文本：
                <a @click="showModal(record.content)">{{record.content}}</a>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                翻译结果：
                <a @click="showModal(record.output_content)">{{record.output_content}}</a>
              </div>
            </a-col>
            <a-col :span="8">
              <div>&nbsp;</div>
            </a-col>
          </a-row>

        </template>
        <template v-else-if="record.trans_type === 1">
          <a-row>
            <a-col :span="8">
              <div>源语言：{{record.src_lang_cn}}</div>
            </a-col>
            <a-col :span="8">
              <div>目标语言：{{record.des_lang_cn}}</div>
            </a-col>
            <a-col :span="8">
              <div>&nbsp;</div>
            </a-col>
          </a-row>
          <a-row style="margin-top: 10px;">
            <a-col :span="8">
              <div>原始图片：
                <a-popover>
                  <template slot="content">
                    <pic-preview :id="record.id"/>
                  </template>
                  <a @click="() => handleClickDownFile(record, 0)" type="link">
                    {{ record.file_name }}
                  </a>
                </a-popover>
              </div>
            </a-col>
            <a-col :span="8">
              <div>识别内容：
                <span v-if="record.state >= TranslateStatus.TransExtractSuccess">
                  <a @click="() => handleClickDownFile(record, 1)" type="link">下载</a>
                </span>
              </div>
            </a-col>
            <a-col :span="8">
              <div>翻译结果：
                <span v-if="record.state >= TranslateStatus.TransTranslateSuccess">
                  <a @click="() => handleClickDownFile(record, 2)" type="link">下载</a>
                </span>
              </div>
            </a-col>
          </a-row>

        </template>
        <template v-else-if="record.trans_type === 2">
          <a-row>
            <a-col :span="8">
              <div>源语言：{{record.src_lang_cn}}</div>
            </a-col>
            <a-col :span="8">
              <div>目标语言：{{record.des_lang_cn}}</div>
            </a-col>
            <a-col :span="8">
              <div>&nbsp;</div>
            </a-col>
          </a-row>
          <a-row style="margin-top: 10px;">
            <a-col :span="8">
              <div>原始文档：
                <a @click="() => handleClickDownFile(record, 0)" type="link">
                  {{ record.file_name }}
                </a>
              </div>
            </a-col>
            <a-col :span="8">
              <div>文档内容：
                <span v-if="record.state >= TranslateStatus.TransExtractSuccess">
                  <a @click="() => handleClickDownFile(record, 1)" type="link">下载</a>
                </span>
              </div>
            </a-col>
            <a-col :span="8">
              <div>翻译结果：
                <span v-if="record.state >= TranslateStatus.TransTranslateSuccess">
                  <a @click="() => handleClickDownFile(record, 2)" type="link">下载</a>
                </span></div>
            </a-col>
          </a-row>

        </template>
      </div>

      <template slot="trans_type" slot-scope="text">
        <div v-if="text === 0">
          文本
        </div>
        <div v-else-if="text === 1">
          <i>图片</i>
        </div>
        <div v-else-if="text === 2">
          <b>文档</b>
        </div>

      </template>

      <template slot="file_name" slot-scope="text, record">
        <a @click="() => handleClickDownFile(record)" type="link">{{ text }}</a>
      </template>

      <template slot="lang" slot-scope="text, record">
        {{ record.src_lang_cn }} -> {{ record.des_lang_cn }}
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

      <template slot="operation" slot-scope="text, record">
        <div>
          <a-popconfirm
              title="确定要删除这条记录吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleClickDelete(record)"
          >
            <a-tooltip title="删除此条记录">
              <a style="margin-left: 20px;">
                <a-icon type="delete"/>
              </a>
            </a-tooltip>
          </a-popconfirm>
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
import {PostDeleteRecord, PostTransDownFile, GetTransLangList} from "../../services/translate";
import TranslateStatus from "../../utils/translateStatus";
import {GetAllTransRecords} from "../../services/admin";
import PicPreview from "./picPreview";

const columnsContent = [
  {
    title: '时间',
    dataIndex: 'create_at',
    scopedSlots: {customRender: 'create_at'},
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'trans_type',
    scopedSlots: {customRender: 'trans_type'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'user_name',
    scopedSlots: {customRender: 'user_name'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '翻译状态',
    dataIndex: 'state_describe',
    scopedSlots: {customRender: 'state_describe'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center',
  },
]

export default {
  name: "historyAll",
  components: {PicPreview},
  props: ["tableHeight"],
  data() {
    return {
      TranslateStatus,
      columnsContent,
      visible: false,
      loading: false,
      tableData: [],
      langList: [],
      pageSizeOptions: ['10', '20', '30', '40', '500'],
      current: 1,
      pageSize: 10,
      total: 0,
      modalContent: "",
    }
  },
  async created() {
    await this.fetchSupportLangList()
    this.fetchTableData()
  },
  methods: {
    showModal(content) {
      this.modalContent = content
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
    },
    copyModal() {
      this.visible = false;
      this.$copy(this.modalContent);
      this.$message.success("已复制到剪贴板")
    },
    expandIcon(props){
        if (props.expanded) {
          return <a style="color: 'black',margin-right:0px" onClick={e => {
            props.onExpand(props.record, e);
          }}><a-icon type="caret-down" /></a>
        } else {
          return <a style="color: 'black' ,margin-right:0px" onClick={e => {
            props.onExpand(props.record, e);
          }}><a-icon type="caret-right" /></a>
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
          this.langList = res.data.data;
          resolve("done")
        }).catch(err => {
          this.$message.warning(err)
          reject(err)
        });
      });
    },
    fetchTableData() {
      GetAllTransRecords((this.current - 1) * this.pageSize, this.pageSize).then(res => {
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
        this.$message.success(res.data.msg);
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
