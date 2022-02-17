<template>
  <div>
    <a-tabs default-active-key="0">
      <a-tab-pane key="0" tab="文本">
        <history-content :langList="langList"/>
      </a-tab-pane>
      <a-tab-pane key="1" tab="图片">
        <history-file :langList="langList" :hisType="1" :columns="columnsImage" :tableHeight="300"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="文档">
        <history-file :langList="langList" :hisType="2" :columns="columnsDocFile" :tableHeight="300"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

import HistoryContent from "./historyContent";
import HistoryFile from "./historyFile";

const columnsImage = [
  {
    title: '创建时间',
    dataIndex: 'create_at',
    ellipsis: true,
    align: 'center',
    width: 200,
    fixed: 'left'
  },
  {
    title: '原始图片',
    dataIndex: 'file_name',
    scopedSlots: {customRender: 'file_name'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '语言',
    dataIndex: 'lang',
    scopedSlots: {customRender: 'lang'},
    ellipsis: true,
    width: 300,
    align: 'center',
  },
  {
    title: '翻译进度',
    dataIndex: 'progress',
    scopedSlots: {customRender: 'progress'},
    align: 'center',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center',
    width: 200,
    fixed: 'right',
  },
];


const columnsDocFile = [
  {
    title: '创建时间',
    dataIndex: 'create_at',
    ellipsis: true,
    align: 'center',
    width: 200,
    fixed: 'left'
  },
  {
    title: '原始文档',
    dataIndex: 'file_name',
    scopedSlots: {customRender: 'file_name'},
    ellipsis: true,
    align: 'center'
  },

  {
    title: '语言',
    dataIndex: 'lang',
    scopedSlots: {customRender: 'lang'},
    ellipsis: true,
    width: 300,
    align: 'center',
  },
  {
    title: '翻译进度',
    dataIndex: 'progress',
    scopedSlots: {customRender: 'progress'},
    align: 'center',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center',
    width: 200,
    fixed: 'right',
  },
];



export default {
  name: "history",
  components: {HistoryFile, HistoryContent},
  props: ["langList"],
  data() {
    return {
      columnsImage,
      columnsDocFile
    }
  }
}
</script>

<style scoped>

</style>
