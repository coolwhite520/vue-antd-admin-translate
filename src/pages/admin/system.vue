<template>
<div>
  <a-card>
    <div slot="title"><a-icon type="redo" />&nbsp;系统服务修复</div>
    <div style="text-align: center">
      <a-button type="primary" style="width: 50%" @click="handleClickRepair" :loading="loading">立即修复</a-button>
    </div>

  </a-card>
  <a-card  style="margin-top: 20px;">
    <div slot="title"><a-icon type="arrow-up" />&nbsp;系统服务升级</div>
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
              注意：必须是.tar后缀的升级文件，否则有可能导致系统崩溃并不可用！
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
import {PostRepairSysApi, WebsocketURl} from "../../services/api"
// import axios from "axios"
const neffos = require('neffos.js');

export default {
  name: "SystemManage",
  data() {
    return {
      fileList: [],
      uploading: false,
      loading: false,
    }
  },
  created() {
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
    handleClickRepair() {
      this.loading = true
        request(PostRepairSysApi, "post")
      .then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
          this.loading = false
          return;
        }
        this.loading = false
        this.$message.success(res.data.msg);
      })
      .catch((err) => {
        this.$message.warning(err.message)
        this.loading = false
        return;
      })
    },

    async upload(file) {
      try {
        const conn = await neffos.dial(WebsocketURl, {
          default: { // "default" namespace.
            _OnNamespaceConnected: function (nsConn, msg) {
              if (nsConn.conn.wasReconnected()) {
                console.log("re-connected after " + nsConn.conn.reconnectTries.toString() + " trie(s)");
              }
              console.log("connected to namespace: " + msg.Namespace);
            },
            _OnNamespaceDisconnect: function (nsConn, msg) {
              console.log("disconnected from namespace: " + msg.Namespace);
            },
            NewFile: function (nsConn, msg) { // "chat" event.
              console.log(msg.Body);
            },
            WriteFile: function (nsConn, msg) { // "chat" event.
              console.log(msg.Body);
            },
            CloseFile: function (nsConn, msg) { // "chat" event.
              console.log(msg.Body);
            }
          }
        }, { // optional.
          reconnect: 2000,
        });
        console.log("begin conn")
        const nsConn = await conn.connect("default");
        let reqObj = {
          file_name: "a.epub",
          data: [],
        }

        nsConn.emit("NewFile", JSON.stringify(reqObj));
        const stream = file.stream()
        stream.on("data", (chunk) => {
          nsConn.emit("WriteFile", chunk.toString("base64"));
        })
        stream.on("finish", () => {
          nsConn.emit("CloseFile", JSON.stringify(reqObj));
        })
      } catch (err) {
        console.error(err.message);
      }
    },
    handleUploadUpdateFile() {
      const {fileList} = this;
      this.upload(fileList[0])
      // const formData = new FormData();
      // fileList.forEach(file => {
      //   formData.append('file', file);
      //   console.log(file)
      // });


      // axios({
      //   url: '/api/admin/upload',
      //   method: 'post',
      //   data: formData,
      //   onUploadProgress (progress) {
      //     console.log(Math.round(progress.loaded / progress.total * 100) + '%');
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
