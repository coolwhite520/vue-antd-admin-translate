<template>
<div>

  <a-card title="IP白名单">
    <div style="margin-top: 10px;margin-bottom: 5px;">
      <a-input-search
          v-model="whiteInputValue"
          placeholder="可输入多个IP地址以逗号分隔或输入IP地址区间段以减号分隔"
          @search="handleClickAdd('white')"
      >
        <a-button slot="enterButton" type="primary">
          <a-icon type="plus-circle" />添加到白名单
        </a-button>
      </a-input-search>
    </div>
    <div slot="extra" style="vertical-align: center">
      <span style="color: darkred">当前IP:{{currUser.ip}}</span>&nbsp;
      <a-switch  checked-children="关闭白名单" un-checked-children="启用白名单" :checked="ipRule==='white'" @change="onChangeSwitchWhite"/>
    </div>

    <a-table :columns="columnsWhite" :data-source="tableDataWhite" rowKey="id" size="small" bordered>
      <a slot="name" slot-scope="text">{{ text }}</a>
      <template slot="operation" slot-scope="text, record">
        <a-tooltip title="删除此条记录">
          <a-popconfirm
              :title="confirmTitle(record)"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleClickDelete(record)"
          >
            <a><a-icon type="delete"/></a>
          </a-popconfirm>
        </a-tooltip>
      </template>
    </a-table>

  </a-card>

  <a-card title="IP黑名单" style="margin-top: 10px;">
    <div style="margin-top: 10px;margin-bottom: 5px;">
      <a-input-search
          placeholder="可输入多个IP地址以逗号分隔或输入IP地址区间段以减号分隔"
          @search="handleClickAdd('black')"
          v-model="blackInputValue"
      >
        <a-button slot="enterButton" type="primary">
          <a-icon type="plus-circle" />添加到黑名单
        </a-button>
      </a-input-search>
    </div>
    <div slot="extra" style="vertical-align: center">
      <span style="color: darkred">当前IP:{{currUser.ip}}</span>&nbsp;
      <a-switch checked-children="关闭黑名单" un-checked-children="启用黑名单" :checked="ipRule==='black'" @change="onChangeSwitchBlack"/>
    </div>
    <a-table :columns="columnsBlack" :data-source="tableDataBlack" rowKey="id" size="small" bordered>
      <a slot="name" slot-scope="text">{{ text }}</a>
      <template slot="operation" slot-scope="text, record">
        <a-tooltip title="删除此条记录">
          <a @click="() => handleClickDelete(record)">
            <a-icon type="delete"/>
          </a>
        </a-tooltip>
      </template>
    </a-table>

  </a-card>
</div>
</template>

<script>
import {
  AddIpTableRecord,
  GetAllIpTableRecords,
  DeleteIpTableRecordById,
  SwitchTableType,
  GetTableType
} from "../../services/admin";
import {mapState} from "vuex";

const columnsWhite = [
  {
    title: '添加时间',
    dataIndex: 'create_at',
    width: 200,
    align: "center",
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    align: "center",
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 200,
    align: "center",
  },
];

const columnsBlack = [
  {
    title: '添加时间',
    dataIndex: 'create_at',
    width: 200,
    align: "center",
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    align: "center",
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 200,
    align: "center",
  },
];
var validate = require('ip-validator');

export default {
  name: "AccessManager",
  data() {
    return {
      ipRule: "",
      columnsWhite,
      columnsBlack,
      tableDataWhite: [],
      tableDataBlack: [],
      whiteInputValue: "",
      blackInputValue: "",
    }
  },
  computed: {
    ...mapState('account', { currUser: 'user'})
  },
  created() {
    this.fetchIpTableRecords()
    this.GetIpTableRulType()
  },
  methods: {
    confirmTitle(record) {
      if (this.ipRule === '' || this.ipRule === 'black') {
        return "确定要删除吗？"
      } else {
        if (record.ip === this.currUser.ip) {
          return `当前启用了白名单，删除会导致您在当前主机无法继续使用，确定要这样做吗？`
        } else {
          return "确定要删除吗？"
        }
      }
    },
    async fetchIpTableRecords() {
      return new Promise((resolve, reject) => {
        GetAllIpTableRecords()
            .then((res) => {
              if (res.data.code !== 200) {
                this.$message.warning(res.data.msg);
                reject(res.data.msg)
                return;
              }
              if (res.data.data !== null) {
                this.tableDataWhite = res.data.data.filter(item => item.type === 'white')
                this.tableDataBlack = res.data.data.filter(item => item.type === 'black')
              } else {
                this.tableDataWhite = []
                this.tableDataBlack = []
              }
              resolve('done')
            })
            .catch((err) => {
              this.$message.warning(err)
              reject(err)
            })
      })
    },
    handleClickDelete(record) {
      if (record.ip === this.currUser.ip && this.ipRule === 'white') {
        this.$message.warning("请先关闭白名单功能，然后进行删除操作，否则将导致您在当前主机无法继续使用！")
        return
      }
      DeleteIpTableRecordById(record.id)
      .then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          return;
        }
        this.$message.success(res.data.msg)
        this.fetchIpTableRecords()
      })
      .catch((err) => {
        this.$message.warning(err)
      })
    },
    handleClickAdd(type) {
      let value = ''
      if (type === 'white') {
        value = this.whiteInputValue
      } else {
        value = this.blackInputValue
      }
      value = value.replaceAll(" ", "")
      // 先判断逗号分隔
      let list = []
      if (value.indexOf("-") > 0) {
        list = value.split("-")
        if (list.length !== 2) {
          this.$message.warning("输入格式有误，请重新输入");
          return;
        }
        if(validate.ipv4(list[0]) && validate.ipv4(list[1])) {
          value = list[0] + "-" + list[1]
        } else {
          this.$message.warning("非法的IP地址格式，请重新输入");
          return;
        }
      } else {
        let arr = value.split(/[,，]/)
        if (arr.length > 0) {
            for (let item of arr) {
               if(validate.ipv4(item)) list.push(item)
            }
            value = list.join(",")
        } else {
          this.$message.warning("输入格式有误，请重新输入");
          return;
        }
      }

      if (value === '') {
        this.$message.warning("输入格式有误，请重新输入");
        return;
      }

      AddIpTableRecord({ip: value, type})
      .then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          return;
        }
        if (type === 'white') {
          this.whiteInputValue = ""
        } else {
          this.blackInputValue = ""
        }
        this.$message.success(res.data.msg)
        this.fetchIpTableRecords()
      })
    },
    async onChangeSwitchWhite() {
      let tip = ""
      if (this.ipRule === 'white') {
        this.ipRule = '';
        tip = "成功关闭白名单功能"
      } else {
        this.ipRule = 'white';
        tip = "成功启用白名单功能"
      }
      try {
        await this.SwitchIpTableRuleType(this.ipRule)
        await this.fetchIpTableRecords()
        this.$message.success(tip);
      }catch (e) {
        this.$message.success(e.message);
      }
    },

    async GetIpTableRulType() {
      return new Promise((resolve, reject) => {
        GetTableType()
            .then((res) => {
              if (res.data.code !== 200) {
                this.$message.warning(res.data.msg);
                reject(res.data.msg);
                return;
              }
              this.ipRule = res.data.data
              resolve(res.data.msg)
            })
            .catch((err) => {
              reject(err);
              return;
            })
      })
    },

    async SwitchIpTableRuleType(ruleType) {
      return new Promise((resolve, reject) => {
        SwitchTableType(ruleType)
        .then((res) => {
          if (res.data.code !== 200) {
            this.$message.warning(res.data.msg);
            reject(res.data.msg);
            return;
          }
          resolve(res.data.msg)
        })
        .catch((err) => {
          reject(err);
          return;
        })
      })
    },
    async onChangeSwitchBlack() {
      let tip = ''
      if (this.ipRule === 'black') {
        this.ipRule = ''
        tip = "成功关闭黑名单功能"
      } else {
        this.ipRule = 'black'
        tip = "成功启用黑名单功能"
      }
      try {
        await this.SwitchIpTableRuleType(this.ipRule)
        await this.fetchIpTableRecords()
        this.$message.success(tip);
      }catch (e) {
        this.$message.success(e.message);
      }

    }
  }
}
</script>

<style scoped>

</style>
