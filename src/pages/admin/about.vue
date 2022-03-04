<template>
  <div style="margin-top: 50px;">
    <a-row>
      <a-col :span="2">
        &nbsp;
      </a-col>
      <a-col :span="20" style="font-size: 16px;border: 1px solid #cbc8c8;padding: 20px;">
        <div >
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
      </a-col>
      <a-col :span="2">
        &nbsp;
      </a-col>
    </a-row>

  </div>
</template>

<script>
import {GetSysInfo} from "../../services/admin";
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
      support_lang_str: ""
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
          this.use_time_span = moment.duration(parseInt(use_time_span), "seconds").asMonths().toFixed() + "个月"
          this.support_lang_str = support_lang_list.map((item) => item.cn_name).join("，")
        })
  },
  methods: {
    handleClickCopy() {
      this.$copy(this.sn)
      this.$message.success("成功复制到剪贴板")
    }
  }
}
</script>

<style scoped>

</style>
