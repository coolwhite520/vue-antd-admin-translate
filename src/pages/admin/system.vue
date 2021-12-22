<template>
  <div>
    <a-card>
      <div slot="title">
        <a-icon type="redo"/>&nbsp;系统服务修复
      </div>
      <div style="text-align: center">
        <a-button type="primary" style="width: 50%" @click="handleClickRepair" :loading="loading">立即修复</a-button>
      </div>

    </a-card>
    <a-card style="margin-top: 20px;">
      <div slot="title">
        <a-icon type="arrow-up"/>&nbsp;系统服务升级
      </div>
      <div style="text-align: center">
        <a-upload-dragger
            :multiple="true"
            :show-upload-list="true"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            listType="text"
            @change="handleChange"

        >
          <!--        accept=".tar"-->
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

        <a-progress
            v-if="percent>0"
            :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
            :percent="percent"
        />
      </div>

    </a-card>
  </div>
</template>

<script>
import {request} from "../../utils/request";
import {PostRepairSysApi} from "../../services/api"
import axios from "axios"
const SparkMD5 = require("spark-md5")

export default {
  name: "SystemManage",
  data() {
    return {
      fileList: [],
      uploading: false,
      loading: false,
      percent: 0,
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

    // async upload(file) {
    //   try {
    //     const conn = await neffos.dial("/api/ws/upload", {
    //       default: { // "default" namespace.
    //         _OnNamespaceConnected: function (nsConn, msg) {
    //           if (nsConn.conn.wasReconnected()) {
    //             console.log("re-connected after " + nsConn.conn.reconnectTries.toString() + " trie(s)");
    //           }
    //           console.log("connected to namespace: " + msg.Namespace);
    //         },
    //         _OnNamespaceDisconnect: function (nsConn, msg) {
    //           console.log("disconnected from namespace: " + msg.Namespace);
    //         },
    //         NewFile: function (nsConn, msg) { // "chat" event.
    //           console.log(msg.Body);
    //         },
    //         WriteFile: function (nsConn, msg) { // "chat" event.
    //           console.log(msg.Body);
    //         },
    //         CloseFile: function (nsConn, msg) { // "chat" event.
    //           console.log(msg.Body);
    //         }
    //       }
    //     }, { // optional.
    //       reconnect: 2000,
    //     });
    //     console.log("begin conn")
    //     const nsConn = await conn.connect("default");
    //     let reqObj = {
    //       file_name: "a.epub",
    //       data: [],
    //     }
    //
    //     nsConn.emit("NewFile", JSON.stringify(reqObj));
    //     const stream = file.stream()
    //     stream.on("data", (chunk) => {
    //       nsConn.emit("WriteFile", chunk.toString("base64"));
    //     })
    //     stream.on("finish", () => {
    //       nsConn.emit("CloseFile", JSON.stringify(reqObj));
    //     })
    //   } catch (err) {
    //     console.error(err.message);
    //   }
    // },
    // 获取文件二进制数据
    async getFileBinary(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function (e) {
          console.log(e)
          resolve(e.target.result)
        }
        reader.onerror = function () {
          reject()
        }
        reader.readAsArrayBuffer(file);
      })

    },
    async upload(formData) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/admin/upload',
          method: 'post',
          data: formData,
          onUploadProgress(progress) {
            console.log(Math.round(progress.loaded / progress.total * 100) + '%');
          },
        }).then((res) => {
          resolve(res)
        })
            .catch((err) => {
              reject(err)
            })
      })
    },
    async sliceUploadFile(file, chunkSize = 1024*1024*50) {
      let totalSize = file.size; // 文件总大小
      let start = 0; // 每次上传的开始字节
      let end = start + chunkSize; // 每次上传的结尾字节
      let order = 1
      this.percent = 0;
      let total = Math.ceil(file.size / chunkSize)
      while (start < totalSize) {
        // 根据长度截取每次需要上传的数据
        // File对象继承自Blob对象，因此包含slice方法
        let blob = file.slice(start, end);
        let arr = await blob.arrayBuffer()
        let spark = new SparkMD5.ArrayBuffer()
        spark.append(arr)
        let fileMd5 = spark.end();
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('order', `${order}`);
        formData.append('total', `${total}`);
        formData.append('fileName', file.name);
        formData.append('fileMd5', fileMd5);

        let res = await this.upload(formData)
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg);
          this.percent = 0;
          return;
        }
        this.percent = Math.round(end / totalSize * 100)
        start = end;
        end = start + chunkSize;
        order++;
      }
      this.percent = 0;
    },
// 读取二进制文件
    async handleUploadUpdateFile() {
      const {fileList} = this;
      for (let file of fileList) {
        // let chunkSize = 2 * 1024 * 1024 // Read in chunks of 2MB
        // let chunks = Math.ceil(file.size / chunkSize)
        await this.sliceUploadFile(file)
      }


      // const formData = new FormData();
      // fileList.forEach(file => {
      //   formData.append('file', file);
      //   console.log(file)
      // });


    }
  }
}
</script>

<style scoped>

</style>
