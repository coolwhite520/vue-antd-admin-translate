<template>
  <div id="my-node" style="margin-top: 30px;">
    <a-result
        status="success"
        title="现有授权已失效，您可以导入新授权"
        :sub-title="subTitle"
    >
      <template #extra>
        <a-button key="buy" @click="handleClickDownProof" type="primary">
          <a-icon type="copy" /> 凭证下载
        </a-button>
        <a-button key="console"  @click="handleClickJumpActivationPage">
          <a-icon type="rollback" /> 导入新授权
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>

import domtoimage from 'dom-to-image';
import {PostActivationProof} from "../../services/activation";

export default {
  name: "BanSuccess",
  data() {
    return {
      id: this.$route.query.id,
      sn: this.$route.query.sn,
      clickPrintPngAndDown: false,
    }
  },
  computed: {
    subTitle() {
      return `失效的授权ID：${this.id}`
    }
  },
  methods: {
    handleClickDownProof() {
      this.clickPrintPngAndDown = true
      PostActivationProof()
          .then((res) => {
            let url = window.URL.createObjectURL(res.data);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", "proof.txt");
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          })
          .catch((err) => {
            this.$message.error(err.message);
          })
    },
    handleClickPrintPng() {
      this.clickPrintPngAndDown = true
      domtoimage.toJpeg(document.getElementById('my-node'), { quality: 1, bgcolor: "#fff"})
          .then(function (dataUrl) {
            let link = document.createElement('a');
            link.style.display = "none";
            link.download = 'proof.jpeg';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(dataUrl); //释放掉blob对象
          }).catch((err) => {
            console.log(err)
            this.$message.warning("发生错误，请手动截图并保存截图文件")
      });
    },
    handleClickJumpActivationPage() {
      if (!this.clickPrintPngAndDown) {
        this.$message.warning("请先点击左侧的【凭证下载】按钮，然后进行后续操作。")
        return
      }
      this.$router.push({path: "/activation",  query: { sn: this.sn }})
    }
  }
}
</script>

<style scoped>
.desc p {
  margin-bottom: 1em;
}
</style>
