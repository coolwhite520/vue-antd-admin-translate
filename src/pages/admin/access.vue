<template>
<div>
  <a-card title="IP白名单">
    <a-switch slot="extra" checked-children="关闭白名单" un-checked-children="启用白名单" :checked="ipRule==='white'" @change="onChangeSwitchWhite"/>
    <a-table :columns="columnsWhite" :data-source="tableDataWhite" rowKey="id" size="small">
      <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>
    <div style="margin-top: 10px;">
      <a-input-search placeholder="可输入多个IP地址x.x.x.x, x.x.x.x, x.x.x.x以逗号分隔或输入地址区间段x.x.x.x-x.x.x.x 以减号分隔">
        <a-button slot="enterButton" type="primary">
          <a-icon type="plus-circle" />添加到白名单
        </a-button>
      </a-input-search>
    </div>
  </a-card>

  <a-card title="IP黑名单" style="margin-top: 10px;">
    <a-switch slot="extra" checked-children="关闭黑名单" un-checked-children="启用黑名单" :checked="ipRule==='black'" @change="onChangeSwitchBlack"/>
    <a-table :columns="columnsBlack" :data-source="tableDataBlack" rowKey="id" size="small">
      <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>
    <div style="margin-top: 10px;">
      <a-input-search placeholder="可输入多个IP地址x.x.x.x, x.x.x.x, x.x.x.x以逗号分隔或输入地址区间段x.x.x.x-x.x.x.x 以减号分隔">
        <a-button slot="enterButton" type="primary">
          <a-icon type="plus-circle" />添加到黑名单
        </a-button>
      </a-input-search>
    </div>
  </a-card>
</div>
</template>

<script>
const columnsWhite = [
  {
    title: '添加时间',
    dataIndex: 'create_at',
    scopedSlots: { customRender: 'create_at' },
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    scopedSlots: { customRender: 'ip' },
  },
  {
    title: '操作',
    dataIndex: 'operator',
    scopedSlots: { customRender: 'operator' },
  },
];

const columnsBlack = [
  {
    title: '添加时间',
    dataIndex: 'create_at',
    scopedSlots: { customRender: 'create_at' },
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    scopedSlots: { customRender: 'ip' },
  },
  {
    title: '操作',
    dataIndex: 'operator',
    scopedSlots: { customRender: 'operator' },
  },
];

export default {
  name: "AccessManager",
  data() {
    return {
      ipRule: "",
      columnsWhite,
      columnsBlack,
      tableDataWhite: [],
      tableDataBlack: []
    }
  },
  methods: {
    onChangeSwitchWhite() {
      let tip = this.ipRule === 'white' ? "确定要关闭白名单吗？": "确定要启用白名单吗？"
      console.log(tip)
      if (this.ipRule === 'white') {
        this.ipRule = '';
      } else {
        this.ipRule = 'white';
      }

    },
    onChangeSwitchBlack() {
      let tip = this.ipRule === 'black' ? "确定要关闭黑名单吗？": "确定要启用黑名单吗？"
      console.log(tip)
      if (this.ipRule === 'black') {
        this.ipRule = ''
      } else {
        this.ipRule = 'black'
      }

    }
  }
}
</script>

<style scoped>

</style>
