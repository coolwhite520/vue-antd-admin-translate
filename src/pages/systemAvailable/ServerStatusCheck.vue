<template>
  <div style="text-align: center;margin-top: 100px;">
    <div style="margin-bottom: 20px">{{msg}}{{dots}}</div>
    <a-progress
        v-show="percent > 0"
        type="circle"
        :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
        :percent="percent"
        :width="200"
        :strokeWidth="10"
    />
  </div>
</template>

<script>


import {GetTransLangList} from "../../services/translate";
import HttpStatus from "../../utils/httpStatus";

export default {
  name: "ServerException",
  data() {
    return {
      msg: "",
      percent: 0,
      dots: ""
    }
  },
  mounted() {
    let loop = setInterval(()=> {
      this.dots = this.dots + "."
      if (this.dots.length >3) {
        this.dots = ""
      }
      GetTransLangList().then((res)=> {
        if (res.data.code === HttpStatus.HttpDockerInitializing
            || res.data.code === HttpStatus.HttpDockerRepairing) {
          this.msg = res.data.msg;
          this.percent = res.data.percent;
          return;
        } else if (res.data.code === HttpStatus.HttpDockerServiceException) {
          this.msg = res.data.msg;
          clearInterval(loop)
          return;
        } else {
          this.msg = "系统状态检测完毕，等待页面自动跳转..."
          clearInterval(loop);
          setTimeout(() => {
            this.percent = 100
            this.$message.success("系统状态检测完毕，可以正常开启翻译之旅。")
            this.$router.push("/translate")
          }, 10 * 1000)
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }, 1000)
  },

}
</script>

<style scoped>

</style>
