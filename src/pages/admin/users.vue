<template>
  <div>
      <a-card title="新增用户">
        <div style="margin-bottom: 10px;color: gray">
          密码必须包含大、小写字母、数字，并至少包含一个特殊字符且长度不能小于12位。
        </div>
        <!-- 禁止浏览器自动填充密码的隐藏输入框 -->
        <a-input type="text" name="hideInput1" style="opacity:0;position:fixed;left:10000px;"></a-input>
        <a-input type="password" name="hideInput2" style="opacity:0;position:fixed;left:10000px;"></a-input>
        <!-- 防止浏览器自动填充密码的隐藏输入框 -->
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
            <a-input
                v-decorator="[
          'userName',
          { rules: [{ required: true, message: '请输入新增用户名' }, { min: 5, message: '用户名必须大于4位!' }] },
        ]"
                placeholder="用户名(必须大于4位)"
                :allowClear="true"
            >
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
            <a-input-search
                @search="handleClickGeneratePwd"
                v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入新增用户密码' }] },
        ]"
                placeholder="密码"
                :allowClear="true"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
              <a-button slot="enterButton" type="primary">
                <a-icon type="reddit" />随机密码
              </a-button>
            </a-input-search>
          </a-form-item>

          <a-form-item>
            <a-input
                v-decorator="['mark']"
                placeholder="备注"
                :allowClear="true"
            >
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
              新增用户
            </a-button>
          </a-form-item>

        </a-form>
      </a-card>

      <a-card style="margin-top: 20px;" title="现有用户列表">
        <a-table :scroll="{ y: 800 }"
                 :pagination="false"
                 :columns="columnsUser"
                 :data-source="tableData"
                 border
                 rowKey="id" style="margin-top: 20px;"
                 size="small">
          <template slot="password" slot-scope="text, record">
            <div v-if="record.isEditable">
              <a-input :ref="'input' + record.username" style="width: 80%" v-model="record.password">
              </a-input>
              &nbsp;
              <a-tooltip title="保存新密码">
                <a-button @click="() => handleClickSaveNewPwd(record)" size="small" shape="circle" icon="save">
                </a-button>
              </a-tooltip>
            </div>
            <div v-else>
              {{ text }}
            </div>
          </template>
          <template slot="mark" slot-scope="text, record">
            <div v-if="record.isEditable">
              <a-input  style="width: 80%" v-model="record.mark" :auto-size="{ minRows: 1, maxRows: 5 }" :allowClear="true"/>
              &nbsp;
              <a-tooltip title="保存新备注">
                <a-button @click="() => handleClickSaveNewMark(record)" size="small" shape="circle" icon="save">
                </a-button>
              </a-tooltip>
            </div>
            <div v-else>
              {{ text }}
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div style="text-align: center">
              <a-tooltip :title="!record.isEditable ? '编辑' : '取消编辑'">
                <a @click="() => handleClickEdit(record)">
                  <a-icon type="edit"/>
                </a>
              </a-tooltip>
              <a-tooltip title="删除此用户">
                <a @click="() => handleClickDeleteUser(record)" style="margin-left: 20px;">
                  <a-icon type="delete"/>
                </a>
              </a-tooltip>

            </div>
          </template>
        </a-table>
      </a-card>
  </div>
</template>

<script>
import {GetAllUsers, PostAddUser, PostModifyUserPwd, DeleteUserById, PostModifyUserMark} from "../../services/admin";

const columnsUser = [
  {
    title: '创建时间',
    dataIndex: 'created_at',
    scopedSlots: {customRender: 'created_at'},
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    scopedSlots: {customRender: 'username'},
    align: 'center'
  },
  {
    title: '密码',
    dataIndex: 'password',
    scopedSlots: {customRender: 'password'},
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'mark',
    scopedSlots: {customRender: 'mark'},
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
    align: 'center'
  },
]

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export default {
  name: "UserManage",
  data() {
    return {
      columnsUser,
      tableData: [],
      hasErrors,
      tempMark: "",
      form: this.$form.createForm(this, {name: 'horizontal_login'}),
    }
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  created() {
    this.fetchUsersList();
  },
  methods: {
    handleClickGeneratePwd() {
      let password = this.$GeneratePwd();
      this.form.setFieldsValue({password})
    },
    handleClickGenerateRowPwd(record) {
      let password = this.$GeneratePwd();
      record.password = password;
    },
    fetchUsersList() {
      GetAllUsers().then((res) => {
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
          return;
        }
        this.tableData = []
        if (res.data.data != null) {
          this.tableData = res.data.data.map((item) => {
            return {
              ...item,
              password: "******",
              isEditable: false,
            }
          })
        }
      }).catch((err) => {
        this.$message.warning(err.message)
      })
    },
    handleClickEdit(record) {
      console.log(record)
      record.isEditable = !record.isEditable
      if (record.isEditable) {
        setTimeout(() => {
          this.$refs['input' + record.username].focus();
        }, 200)
        record.password = ""
        this.tempMark = record.mark;
      } else {
        record.password = "******"
        record.mark = this.tempMark
      }
    },
    handleClickSaveNewMark(record) {
      let {id, mark} = record;
      mark = mark.trim();
      PostModifyUserMark({id, mark})
          .then((res) => {
            console.log(res)
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              return
            }
            this.$message.success(`修改新备注成功`)
            this.$router.go(0);
          })
          .catch((err) => {
            this.$message.warning(err.message)
            return;
          })
    },
    handleClickSaveNewPwd(record) {
      let {id, username, password} = record;
      password = password.trim();
      let list = this.$PasswordValidator(password)
      if (list.length > 0) {
        let tips = list.map(item => item.message)
        let tipMsg = tips.join("，")
        this.$message.warning(tipMsg + "。")
        return
      }
      PostModifyUserPwd({id, new_password: password})
          .then((res) => {
            console.log(res)
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              return
            }
            let info = `账号：${username}\r\n密码：${password}`
            this.$copy(info)
            this.$notification.success(
                {
                  message:  `修改用户：${username} 密码成功`,
                  description: `新信息已复制到剪贴板`,
                }
            )
            this.fetchUsersList()
            record.isEditable = false
            record.password = "******"
          })
          .catch((err) => {
            this.$message.warning(err.message)
            return;
          })
    },
    handleClickDeleteUser(record) {
      console.log(record)
      DeleteUserById(record.id)
          .then((res) => {
            console.log(res)
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              return
            }
            this.$message.success(`删除用户成功`)
            this.fetchUsersList()
          })
          .catch((err) => {
            this.$message.warning(err.message)
            return;
          })
    },
    // Only show error after a field is touched.
    userNameError() {
      const {getFieldError, isFieldTouched} = this.form;
      return isFieldTouched('userName') && getFieldError('userName');
    },
    // Only show error after a field is touched.
    passwordError() {
      const {getFieldError, isFieldTouched} = this.form;
      return isFieldTouched('password') && getFieldError('password');
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let {userName: username, password, mark} = values
          let list = this.$PasswordValidator(password)
          if (list.length > 0) {
            let tips = list.map(item => item.message)
            let tipMsg = tips.join("，")
            this.$message.warning("密码：" + tipMsg + "。")
            return
          }
          PostAddUser({username, password, mark})
              .then((res) => {
                console.log(res)
                if (res.data.code !== 200) {
                  this.$message.warning(res.data.msg)
                  return
                }
                let info = `账号：${username}\r\n密码：${password}`
                this.$copy(info)
                this.$notification.success(
                    {
                      message:  `新增用户：${username} 成功`,
                      description: `用户信息已复制到剪贴板`,
                    }
                )
                this.fetchUsersList()
              })
              .catch((err) => {
                this.$message.warning(err.message)
                return;
              })

        }
      });
    },
  }
}
</script>

<style scoped>

</style>
