<template>
  <div style="text-align: center;margin-top: 50px;">
    <div>{{msg}}</div>
    <a-progress
        v-show="percent > 0"
        type="circle"
        :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
        :percent="percent"
    />
  </div>
</template>

<script>


export default {
  name: "ServerException",
  data() {
    return {
      msg: "",
      percent: 0,
    }
  },
  mounted() {

  },

}
</script>

<style scoped>

</style>
