<template>
<div>
  <a-card>
    <history-all :tableHeight="500" ref="historyChild"/>
  </a-card>

</div>
</template>

<script>

import HistoryAll from "../history/historyAll";

export default {
  name: "allRecords",
  components: {HistoryAll},
  data() {
    return {

    }
  },
  async created() {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
