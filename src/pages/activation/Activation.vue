<template>
  <div style="text-align: center;margin-top: 50px;">
    <a-col :xs="0" :sm="0" :md="0" :lg="6" :xl="6">
      &nbsp;
    </a-col>
    <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <div v-if="!activationOk">
        <span>平台序列号：</span> <b>{{ sn }}</b>&nbsp;
        <a-tooltip>
          <template slot="title">
            <span>点击复制机器码</span>
          </template>
          <a-button type="primary" icon="copy" size="small" @click="handleClickCopy"/>
        </a-tooltip>
        <div style="margin-top: 10px">
          <a-tag color="orange">请将平台序列号和凭证一并发送给激活方，并告知您想要支持的语言种类。</a-tag>
        </div>
        <div style="margin-top: 40px;">
          <a-textarea
              style="width: 100%"
              v-model="keystore"
              placeholder="请在此处粘贴激活码"
              :auto-size="{ minRows: 10, maxRows: 10 }"
          />
        </div>
        <div style="margin-top: 20px;">
          <a-button style="width: 29%" size="large" @click="handleClickDownProof" type="danger">
            <a-icon type="crown"/>
            凭证下载
          </a-button>
          &nbsp;
          <a-button type="primary" style="width: 70%" size="large" @click="handleClickActivation">立即激活</a-button>
        </div>
      </div>
    </a-col>
    <a-col :xs="0" :sm="0" :md="0" :lg="6" :xl="6">
      &nbsp;
    </a-col>
  </div>
</template>

<script>
import {PostActivation, PostActivationProof} from "../../services/activation";


export default {
  name: "Activation",
  data() {
    return {
      sn: this.$route.query.sn,
      keystore: "",
      activationOk: false,
    }
  },
  methods: {
    handleClickDownProof() {
      PostActivationProof()
          .then((res) => {
            let url = window.URL.createObjectURL(res.data);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", `凭证_${this.sn.slice(0,8)}.txt`);
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          })
          .catch((err) => {
            this.$message.error(err.message);
          })
    },
    handleClickCopy() {
      this.$copy(this.sn)
      this.$message.success("成功复制到剪贴板")
    },
    handleClickActivation() {
      if (this.keystore === "") {
        this.$message.warning("激活码不能为空！")
        return;
      }
      let obj = {
        sn: this.sn,
        keystore: this.keystore
      }
      PostActivation(obj)
          .then(res => {
            console.log(res)
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              this.keystore = ""
              return;
            }
            this.$router.push("/systemAvailable")
          })
          .catch(err => {
            this.$message.error(err.message)
          })
    }
  }
}
</script>

<style scoped>

</style>
