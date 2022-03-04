<template>
  <div>
    <a-row>
      <a-col :xs="0" :sm="0" :md="3" :lg="3" :xl="3">
        &nbsp;
      </a-col>
      <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <a-tabs :activeKey="activeKey" @change="onChangeTabs">
          <a-tab-pane key="0" tab="用户管理">
            <user-manage v-if="activeKey === '0'"/>
          </a-tab-pane>
          <a-tab-pane key="1" tab="IP管理">
            <access-manager v-if="activeKey === '1'"/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="访问记录">
            <user-history v-if="activeKey === '2'"/>
          </a-tab-pane>
          <a-tab-pane key="3" tab="翻译记录">
            <history-admin-see :tableHeight="500" v-if="activeKey === '3'"/>
          </a-tab-pane>
          <a-tab-pane key="4" tab="系统维护">
            <system-manage v-if="activeKey === '4'"/>
          </a-tab-pane>
          <a-tab-pane key="5" tab="系统信息">
            <about v-if="activeKey === '5'"/>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :xs="0" :sm="0" :md="3" :lg="3" :xl="3">
        &nbsp;
      </a-col>
    </a-row>
  </div>
</template>

<script>

import UserManage from "./users";
import SystemManage from "./system";
import AccessManager from "./access";
import UserHistory from "./userHistory";
import HistoryAdminSee from "../history/historyAdminSee"
import About from "./about";
export default {
  name: "admin",
  data() {
    return {
      activeKey: '0',
    }
  },
  methods: {
    onChangeTabs(val) {
      this.activeKey = val
    }
  },
  components: {About, UserHistory, AccessManager, SystemManage, UserManage, HistoryAdminSee},
}
</script>

<style scoped>

</style>
