<template>
  <div>
    <div style="text-align: right;margin-right: 10px;">
      <a-checkbox  :defaultChecked="false" @change="onChangeAutoFresh">
        自动刷新
      </a-checkbox>
      <a-tooltip title="点击刷新">
        <a-icon type="sync" :spin="loading" @click="handleClickFresh"/>
      </a-tooltip>
    </div>
    <a-table :scroll="{ y: 800 }"
             v-show="this.tableData.length>0"
             :columns="columnsImage"
             :data-source="tableData"
             rowKey="id" style="margin-top: 20px;"
             size="small">

      <template slot="file_name" slot-scope="text, record">
        <a @click="() => handleClickDownFile(record, 0)" type="link">{{ text }}</a>
      </template>

      <template slot="file_content" slot-scope="text, record">
        <div v-if="record.state >= TranslateStatus.TransExtractSuccess">
          <a @click="() => handleClickDownFile(record, 1)" type="link"> {{record.file_name + ".txt"}}</a>
        </div>
      </template>
      <template slot="lang" slot-scope="text, record">
        {{record.src_lang}} -> {{record.des_lang}}
      </template>

      <template slot="state_describe" slot-scope="text, record">
        <div v-if="record.state === TranslateStatus.TransTranslateSuccess" style="color: #52c41a;">
          {{text}}
        </div>
        <div v-else style="color: #f5222f;">
          {{text}}&nbsp;{{record.error}}
        </div>
      </template>

      <template slot="file_trans" slot-scope="text, record">
        <div v-if="record.state >= TranslateStatus.TransTranslateSuccess">
          <a @click="() => handleClickDownFile(record, 2)" type="link"> {{record.file_name + ".txt"}}</a>
        </div>
      </template>

      <template slot="operation" slot-scope="text, record">
        <div style="text-align: center">
          <a-tooltip title="删除此条记录">
            <a @click="() => handleClickDelete(record)">
              <a-icon type="delete"/>
            </a>
          </a-tooltip>

        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { GetRecordsByType, PostTransDownFile} from "../../services/translate";
import TranslateStatus from "../../utils/translateStatus";

const columnsImage = [
  {
    title: '开始时间',
    dataIndex: 'create_at',
    scopedSlots: {customRender: 'create_at'},
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
  {
    title: '文件内容',
    dataIndex: 'file_content',
    scopedSlots: {customRender: 'file_content'},
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
    align: 'center'
  },
];

export default {
  name: "historyDocFile",
  data() {
    return {
      TranslateStatus,
      columnsImage,
      tableData: [],
      loading: false,
      autoFresh: false,
      loop: null,
    }
  },
  created() {
    GetRecordsByType(2).then(res => {
      if (res.data.code !== 200) {
        this.$message.warning(res.data.msg);
        return;
      }
      if(res.data.data != null) {
        this.tableData = res.data.data
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  },
  methods: {
    onChangeAutoFresh(e) {
      if (e.target.checked) {
        this.loading = true
        this.loop = setInterval(() => {
          this.handleClickFresh();
        }, 2000)
      } else {
        clearInterval(this.loop)
        this.loading = false
      }
    },
    handleClickFresh() {
      this.loading = true
      setTimeout(() => {
        GetRecordsByType(2).then(res => {
          if (res.data.code !== 200) {
            this.$message.warning(res.data.msg);
            this.loading = false
            return;
          }
          if(res.data.data != null) {
            this.tableData = res.data.data
          }
          this.loading = false
        }).catch((err) => {
          this.$message.error(err.message)
          this.loading = false
        })
      }, 1500)
    },
    handleClickDelete(item) {
      const index = this.tableData.indexOf(item);
      const newFileList = this.tableData.slice();
      newFileList.splice(index, 1);
      this.tableData = newFileList;
    },
    handleClickDownFile(item, type) {
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
  }
}
</script>

<style scoped>

</style>
