<template>
<div>
  <a-card>
    <div slot="title"><a-icon type="redo" />&nbsp;系统重启</div>
    <div style="text-align: center">
      <a-button type="primary" style="width: 50%" @click="handleClickRestart">立即重启</a-button>
    </div>

  </a-card>
  <a-card  style="margin-top: 20px;">
    <div slot="title"><a-icon type="arrow-up" />&nbsp;系统升级</div>
    <div style="text-align: center">
      <a-upload-dragger
          :multiple="true"
          :show-upload-list="true"
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          listType="text"
          @change="handleChange"
          accept=".tar"
      >
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <p class="ant-upload-drag-icon">
              <a-icon type="file-text"/>
            </p>
            <p class="ant-upload-text">
              点击或拖拽到此区域
            </p>
            <p class="ant-upload-hint">
              注意：必须是.tar后缀的升级文件，否则有可能导致系统崩溃不可用！
            </p>
          </a-col>
        </a-row>
      </a-upload-dragger>

      <a-button
          type="primary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style="margin-top: 16px;width: 40%"
          @click="handleUploadUpdateFile"
      >
        {{ uploading ? '上传中' : '开始上传' }}
      </a-button>

    </div>

  </a-card>
</div>
</template>

<script>
import {request} from "../../utils/request";
import {PostRestartSysApi} from "../../services/api"
export default {
  name: "SystemManage",
  data() {
    return {
      fileList: [],
      uploading: false,
    }
  },
  methods: {
    handleChange(info) {
      console.log(info)
    },
    handleRemove(file) {
      console.log("remove")
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      console.log("beforeUpload:", file)
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleClickRestart() {
        request(PostRestartSysApi, "post")
      .then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
          return;
        }
        this.$message.success(res.data.msg);
      })
      .catch((err) => {
        this.$message.warning(err.message)
        return;
      })
    },
    handleUploadUpdateFile() {

    }
  }
}
</script>

<style scoped>

</style>
