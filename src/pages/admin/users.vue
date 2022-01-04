<template>
  <div>
      <a-card title="新增用户">
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
            >
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
            <a-input
                v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入新增用户密码' }, { min: 5, message: '密码必须大于4位!' }] },
        ]"
                placeholder="密码(必须大于4位)"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-textarea
                v-decorator="['mark']"
                placeholder="备注"
                :auto-size="{ minRows: 1, maxRows: 5 }"
                :allowClear="true"
            >
            </a-textarea>
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
              <a-input :ref="'input' + record.username" style="width: 80%" v-model="record.password"/>
              &nbsp;
              <a-tooltip title="保存新密码">
                <a @click="() => handleClickSaveNewPwd(record)">
                  <a-icon type="save"/>
                </a>
              </a-tooltip>
            </div>
            <div v-else>
              {{ text }}
            </div>
          </template>
          <template slot="mark" slot-scope="text, record">
            <div v-if="record.isEditable">
              <a-textarea  style="width: 80%" v-model="record.mark" :auto-size="{ minRows: 1, maxRows: 5 }" :allowClear="true"/>
              &nbsp;
              <a-tooltip title="保存新备注">
                <a @click="() => handleClickSaveNewMark(record)">
                  <a-icon type="save"/>
                </a>
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
      let {id, password} = record;
      console.log(record)
      password = password.trim();
      if (password.length < 5) {
        this.$message.warning("密码必须大于4位")
        return
      }
      PostModifyUserPwd({id, new_password: password})
          .then((res) => {
            console.log(res)
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg)
              return
            }
            this.$message.success(`修改密码成功, 新密码:${password}`)
            record.isEditable = false
            record.password = "******"
            this.$router.go(0);
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
          PostAddUser({username, password, mark})
              .then((res) => {
                console.log(res)
                if (res.data.code !== 200) {
                  this.$message.warning(res.data.msg)
                  return
                }
                this.$message.success("新增用户成功")
                this.$router.go(0);
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
