<template>
<div>
  <a-card>
    <history-all :langList="langList" :tableHeight="500" ref="historyChild"/>
  </a-card>

</div>
</template>

<script>

import {GetTransLangList} from "../../services/translate";
import HistoryAll from "../history/historyAll";

export default {
  name: "allRecords",
  components: {HistoryAll},
  data() {
    return {
      langList: []
    }
  },
  async mounted() {
    await this.fetchSupportLangList()
  },
  methods: {
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
  }
}
</script>

<style scoped>

</style>
