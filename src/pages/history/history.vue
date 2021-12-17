<template>
  <div>
    <a-tabs default-active-key="0">
      <a-tab-pane key="0" tab="文本">
        <history-content/>
      </a-tab-pane>
      <a-tab-pane key="1" tab="图片">
        <history-image/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="文档">
        <history-doc-file/>
      </a-tab-pane>

    </a-tabs>


  </div>
</template>

<script>


import HistoryContent from "./historyContent";
import HistoryDocFile from "./historyDocFile";
import HistoryImage from "./historyImage";
export default {
  name: "history",
  components: {HistoryImage, HistoryDocFile, HistoryContent},
}
</script>

<style scoped>

</style>
