<template>
  <div style="margin-top: 50px;">
    <a-card title="授权信息">
      <div>
        当前系统版本：<b>v{{ user.sysVer }}</b>
      </div>
      <div style="margin-top: 20px">
        序列号：<b>{{ sn }}</b>
        &nbsp;<a-button type="primary" icon="copy" size="small" @click="handleClickCopy"/>
      </div>
      <div style="margin-top: 20px">
        被授权方名称：<b>{{ user_name }}</b>
      </div>
      <div style="margin-top: 20px">
        系统激活日期：<b>{{ created_at }}</b>
      </div>
      <div style="margin-top: 20px">
        系统有效期：<b>{{ use_time_span }}</b>
      </div>
      <div style="margin-top: 20px">
        支持的语言：<b>{{ support_lang_str }}</b>
      </div>
      <a-row style="margin-top: 20px">
        <a-popconfirm
            title="导入新的授权将使得现有授权永久失效，确定这样做吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleClickBanCurrActivation"
            @cancel="() => {}"
        >
            <a-button type="danger">
              <a-icon type="import" />
              导入新授权
            </a-button>
        </a-popconfirm>
      </a-row>
      <div style="margin-top: 10px">
        <a-tag color="orange" closable>
          导入新授权会使得当前授权在本机永久失效，请谨慎操作！
        </a-tag>
      </div>
    </a-card>
  </div>
</template>

<script>
import {GetSysInfo} from "../../services/admin";
import {PostBan} from "../../services/activation";
import moment from 'moment'
import {mapGetters} from "vuex";

export default {
  name: "about",
  data() {
    return {
      user_name: "",
      sn: "",
      created_at: "",
      use_time_span: "",
      support_lang_str: "",
      loading: false,
    }
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  mounted() {
    GetSysInfo()
        .then((res) => {
          if (res.data.code !== 200) {
            this.$message.warning(res.data.msg);
            return;
          }
          console.log(res.data)
          const {user_name, sn, use_time_span, created_at, support_lang_list} = res.data.data
          this.sn = sn
          this.created_at = moment(created_at * 1000).format("YYYY-MM-DD")
          this.user_name = user_name
          let month = moment.duration(parseInt(use_time_span), "seconds").asMonths().toFixed()
          this.use_time_span = month > 240 ? `永久` : `${month} 个月`
          this.support_lang_str = support_lang_list.map((item) => item.cn_name).join("，")
        })
  },
  methods: {
    handleClickCopy() {
      this.$copy(this.sn)
      this.$message.success("成功复制到剪贴板")
    },
    handleClickBanCurrActivation() {
      PostBan()
          .then((res) => {
            if (res.data.code !== 200) {
              this.$message.warning(res.data.msg);
              return;
            }
            this.$message.success(res.data.msg)
            const { sn, id } = res.data.data
            this.$router.push({path: "/ban",  query: { sn, id}})
          })
          .catch((err) => {
            this.$message.warning(err)
          })
    },
    handleClickImportActivation() {
      console.log("haha")
      this.$router.push({
        path: '/activation',
        query: {
          sn:this.sn
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
