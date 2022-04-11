<template>
  <div>
    <a-spin :tip="pageLoadingTip" :spinning="loading">

      <a-card>
        <a slot="extra" href="#">
          <a-tooltip title="可导出系统运行日志">
            <a-button type="link" @click="handleClickDownSysLog" :loading="loadingBtn">
              <a-icon type="download"/>
              导出系统日志
            </a-button>
          </a-tooltip>
        </a>
        <div slot="title">
          <a-icon type="dashboard"/>&nbsp;系统仪表盘
        </div>
        <a-row v-if="this.cpuMemDisk">
          <a-col :span="8">
            <a-row>
              <a-col :span="7">&nbsp;</a-col>
              <a-col :span="12">
                <sys-cpu-chart title="cpu使用率" :percent="parseInt(this.cpuMemDisk.cpu_percent)"/>
              </a-col>
              <a-col :span="5">&nbsp;</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <sys-pie-chart title="内存占用率" :percent="parseInt(this.cpuMemDisk.mem_percent)"/>
          </a-col>
          <a-col :span="8">
            <sys-bar-chat title="磁盘IO"
                          :io_read_bytes="this.cpuMemDisk.io_read_bytes"
                          :io_write_bytes="this.cpuMemDisk.io_write_bytes"
                          :io_read_bytes_str="this.cpuMemDisk.io_read_bytes_str"
                          :io_write_bytes_str="this.cpuMemDisk.io_write_bytes_str"
            />
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin-top: 20px;">
        <div slot="title">
          <a-icon type="cloud-upload"/>&nbsp;系统组件维护
        </div>
        <a slot="extra" href="#">
          <a-tooltip title="可自动修复运行状态不佳的组件">
            <a-button type="link" @click="handleClickRepair">
              <a-icon type="tool"/>
              组件自动修复
            </a-button>
          </a-tooltip>
        </a>
        <a-table :scroll="{ y: 800 }"
                 :pagination="false"
                 :columns="columnsComponents"
                 :data-source="tableData"
                 rowKey="name"
                 style="margin-top: 20px;"
                 size="small"
        >
          <template slot="comps_state_describe" slot-scope="text,record">
            <div v-if="record.comps_state === 0" style="color: green; font-weight: bold">
              <a-icon type="sync" spin/>
              {{ text }}
            </div>
            <div v-else-if="record.comps_state === 1">
              <a-icon type="stop"/>
              {{ text }}
            </div>
            <div v-else>
              <a-icon type="disconnect"/>
              {{ text }}
            </div>
          </template>
          <template slot="versions" slot-scope="text, record">
            <div v-if="record.versions && record.versions.length > 0">
              <a-select v-model="record.up_version" @change="(value) => { handleChangeVersion(value, record) }"
                        style="width: 80px;">
                <a-select-option v-for="item in record.versions" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
            <div v-else>无</div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div style="text-align: center">
              <a-popconfirm
                  :title="record.up_version > record.current_version ? '确定要升级当前组件吗？': '确定要恢复当前组件吗？'"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleClickUpgrade(record)"
                  @cancel="cancel"
              >
                <a-tooltip title="升级或恢复操作">
                  <a-button :disabled="record.up_version === ''" size="small" type="primary">
                    <a-icon :type="record.up_version > record.current_version ? 'cloud-upload':'redo'"/>
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
              <a-tooltip title="导出组件日志">
                <a-button style="margin-left: 20px" size="small" @click="handleClickLogsContainer(record)" :loading="loadingBtn">
                  <a-icon type="download"/>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </a-table>

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
                <p class="ant-upload-text" style="color:  #555454">
                  点击或拖拽到此区域
                </p>
                <p class="ant-upload-hint">
                  注意：必须是官方提供的.zip后缀的升级文件，否则可能导致系统崩溃不可用！
                </p>
                <p class="ant-upload-hint">
                  上传成功后系统会自动检测新组件的版本信息
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
    </a-spin>
  </div>
</template>

<script>
import {request} from "../../utils/request";
import {PostRepairSysApi} from "../../services/api"
import axios from "axios"

const SparkMD5 = require("spark-md5")
import {
  GetComponents,
  PostUpgrade,
  GetSystemCpuMemIoDetail,
  PostDownContainerLogs,
  PostDownSysLogs,
} from "../../services/admin";
import {mapState} from "vuex";
import SysPieChart from "./SysPieChart";
import SysBarChat from "./SysBarChart";
import SysCpuChart from "./SysCpuChart";


const columnsComponents = [
  {
    title: '组件名称',
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'},
    align: 'center'
  },
  {
    title: '当前版本',
    dataIndex: 'current_version',
    scopedSlots: {customRender: 'current_version'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '组件状态',
    dataIndex: 'comps_state_describe',
    scopedSlots: {customRender: 'comps_state_describe'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '可用版本',
    dataIndex: 'versions',
    scopedSlots: {customRender: 'versions'},
    ellipsis: true,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center'
  },
]
// import {logout} from '@/services/user'
export default {
  name: "SystemManage",
  components: {SysCpuChart, SysBarChat, SysPieChart},
  data() {
    return {
      columnsComponents,
      fileList: [],
      loading: false,
      uploading: false,
      percent: 0,
      tableData: [],
      pageLoadingTip: "",
      loop: null,
      cpuMemDisk: null,
      loadingBtn: false,
    }
  },
  created() {
    this.fetchComponents()
    this.loop = setInterval(() => {
      this.fetchComponents()
    }, 10 * 1000)

    this.fetchCpuMemIo()
    this.loop2 = setInterval(() => {
      this.fetchCpuMemIo()
    }, 5 * 1000)
  },
  updated() {
    // 表格斑马行显示
    this.renderStripe()
  },
  destroyed() {
    if (this.loop) {
      console.log("clearInterval this.fetchComponents...")
      clearInterval(this.loop)
    }
    if (this.loop2) {
      console.log("clearInterval this.fetchComponents...")
      clearInterval(this.loop2)
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
  },
  methods: {
    // 表格斑马行显示
    renderStripe() {
      const table = document.getElementsByClassName('ant-table-row')
      if (this.tableData.length > 0) {
        this.tableData.map((row, index) => {
          let rowElement = table[index]
          if (row.comps_state === 0) {
            rowElement.style.backgroundColor = '#ebface'
          } else {
            rowElement.style.backgroundColor = '#f6adad'
          }
        })
      }
    },
    cancel() {

    },
    fetchComponents() {
      GetComponents().then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
          return;
        }
        this.tableData = res.data.data.map((item) => {
          let arr = item.versions.filter((a) => {
            return a > item.current_version
          })
          return {
            ...item,
            up_version: arr.length > 0 ? arr[0] : item.current_version
          }
        });
      })
          .catch((err) => {
            this.$message.warning(err.message);
          })
    },
    fetchCpuMemIo() {
      GetSystemCpuMemIoDetail().then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
          return;
        }
        console.log(res.data)
        this.cpuMemDisk = res.data.data
      })
          .catch((err) => {
            this.$message.warning(err.message);
          })
    },
    handleChange(info) {
      console.log(info)
    },
    handleChangeVersion(v, record) {
      console.log(v, record)
      record["up_version"] = v
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
    handleClickDownSysLog() {
      this.handleClickDownSysLogFile()
    },
    handleClickLogsContainer(record) {
      this.handleClickDownFile(record)
    },
    async handleClickDownSysLogFile() {
      this.loadingBtn = true;
      PostDownSysLogs()
          .then((res) => {
            let contentDisposition = res.headers['content-disposition']
            console.log(contentDisposition)
            let arr = contentDisposition.split(";")
            let fileName = arr[1].split("=")[1]
            let url = window.URL.createObjectURL(res.data);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", fileName);
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
            this.loadingBtn = false;
          })
          .catch((err) => {
            this.$message.error(err.message);
            this.loadingBtn = false;
          })
    },
    async handleClickDownFile(item) {
      this.loadingBtn = true;
      PostDownContainerLogs(item.name)
          .then((res) => {
            let url = window.URL.createObjectURL(res.data);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", item.name + ".zip");
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
            this.loadingBtn = false;
          })
          .catch((err) => {
            this.$message.error(err.message);
            this.loadingBtn = false;
          })
    },

    handleClickRepair() {
      this.loading = true
      this.pageLoadingTip = "正在进行全局组件修复，请稍后..."
      request(PostRepairSysApi, "post")
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              this.loading = false
              return;
            }
            this.loading = false
            this.$message.success(res.data.msg);
            this.fetchComponents();
          })
          .catch((err) => {
            this.$message.warning(err.message)
            this.loading = false
            return;
          })
    },

    handleClickUpgrade(item) {

      this.loading = true
      if (item.up_version > item.current_version) {
        this.pageLoadingTip = `正在进行${item.name}组件的升级，请稍后...`
      } else {
        this.pageLoadingTip = `正在进行${item.name}组件的恢复，请稍后...`
      }
      PostUpgrade(item)
          .then((res) => {
            if (item.name === 'web') {
              setTimeout(() => {
                this.$router.push("/login")
                this.$router.go(0)
              }, 5000)
            } else {
              if (res.data.code !== 200) {
                this.$message.warning(res.data.msg)
                this.loading = false
                return;
              }
              this.loading = false
              this.$message.success(res.data.msg);
              this.fetchComponents()
            }
          })
          .catch(() => {
            this.loading = false
            setTimeout(() => {
              this.$router.push("/login")
              this.$router.go(0)
            }, 2000)
          })
    },
    async upload(formData) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/admin/upload',
          method: 'post',
          data: formData,
          // onUploadProgress(progress) {
          //   console.log(Math.round(progress.loaded / progress.total * 100) + '%');
          // },
        }).then((res) => {
          resolve(res)
        })
            .catch((err) => {
              reject(err)
            })
      })
    },
    async sliceUploadFile(file,) {
      let totalSize = file.size; // 文件总大小
      let chunkSize = Math.ceil(file.size / 100);
      let start = 0; // 每次上传的开始字节
      let end = start + chunkSize; // 每次上传的结尾字节
      let order = 1
      this.percent = 0;
      let total = Math.ceil(file.size / chunkSize)
      let res;
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

        res = await this.upload(formData)
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
      if (res.data.code !== 200) {
        this.$message.warning(res.data.msg);
        this.percent = 0;
        return;
      }
      let {image_name, image_version} = res.data.data
      this.$notification.success(
          {
            message: '上传组件成功',
            description: `成功的上传了组件:${image_name}，版本:${image_version}，可进行升级、恢复操作！`,
          }
      )
      this.fetchComponents();
    },
// 读取二进制文件
    async handleUploadUpdateFile() {
      const {fileList} = this;
      this.uploading = true
      for (let file of fileList) {
        await this.sliceUploadFile(file)
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      }
      this.uploading = false
    }
  }
}
</script>

<style scoped>
</style>
