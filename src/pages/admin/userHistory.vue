<template>
  <div>
    <div style="text-align: right">
      <a-popconfirm
          title="确定要清空所有数据吗？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleClickDeleteAll"
      >
        <a-button type="primary">清空所有数据</a-button>
      </a-popconfirm>
    </div>
    <a-table :scroll="{ y: 800 }"
             :pagination="false"
             :columns="columnsUserOperatorRecords"
             :data-source="tableData"
             rowKey="id" style="margin-top: 5px;"
             :border="true"
    >
      <div slot="operator" slot-scope="text">
        <div v-if="text ==='login'" style="color: #52c41a">
          登录
        </div>
        <div v-else-if="text ==='logoff'" style="color: darkred">
          退出
        </div>
      </div>
      <template slot="operation" slot-scope="text, record">
        <a-tooltip title="删除此条记录">
          <a @click="() => handleClickDelete(record)">
            <a-icon type="delete"/>
          </a>
        </a-tooltip>
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
import {DeleteAllOperatorRecord, DeleteOperatorRecordById, GetUserOperatorRecords} from "../../services/admin";


const columnsUserOperatorRecords = [
  {
    title: '时间',
    dataIndex: 'create_at',
    scopedSlots: {customRender: 'create_at'},
  },
  {
    title: '用户名',
    dataIndex: 'username',
    scopedSlots: {customRender: 'username'},
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    scopedSlots: {customRender: 'ip'},
  },
  {
    title: '类型',
    dataIndex: 'operator',
    scopedSlots: {customRender: 'operator'},
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
  },
]
export default {
  name: "userHistory",
  data() {
    return {
      columnsUserOperatorRecords,
      loading: false,
      tableData: [],
      pageSizeOptions: ['10', '20', '30', '40', '500'],
      current: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created() {
    this.fetchUserOperatorRecords()
  },
  methods: {
    onChangePage() {
      this.fetchUserOperatorRecords()
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.fetchUserOperatorRecords()
    },
    handleClickDelete(item) {
      DeleteOperatorRecordById(item.id)
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
            this.fetchUserOperatorRecords();
          })
          .catch((err) => {
            this.$message.error(err.message);
            return;
          })
    },
    handleClickDeleteAll() {
      DeleteAllOperatorRecord()
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
            this.fetchUserOperatorRecords();
          })
          .catch((err) => {
            this.$message.error(err.message);
            return;
          })
    },
    fetchUserOperatorRecords() {
      GetUserOperatorRecords((this.current - 1) * this.pageSize, this.pageSize)
          .then((res) => {
            console.log(res)
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
            let {list, total} = res.data.data
            if (list !== null) {
              this.tableData = list
            } else {
              this.tableData = []
            }
            this.total = total
          })
    }
  }
}
</script>

<style scoped>

</style>
