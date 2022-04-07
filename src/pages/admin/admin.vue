<template>
  <div>
    <a-row>
      <a-col :xs="0" :sm="0" :md="3" :lg="3" :xl="3">
        &nbsp;
      </a-col>
      <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <a-tabs :activeKey="activeKey" @change="onChangeTabs">
          <a-tab-pane key="0" >
            <template slot="tab">
              <a-icon type="user" />用户管理
            </template>
            <user-manage v-if="activeKey === '0'"/>
          </a-tab-pane>
          <a-tab-pane key="1">
            <template slot="tab">
              <a-icon type="cluster" />IP管理
            </template>
            <access-manager v-if="activeKey === '1'"/>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template slot="tab">
              <a-icon type="export" />访问记录
            </template>
            <user-history v-if="activeKey === '2'"/>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template slot="tab">
              <a-icon type="history" />翻译记录
            </template>
            <history-admin-see :tableHeight="500" v-if="activeKey === '3'"/>
          </a-tab-pane>
          <a-tab-pane key="4">
            <template slot="tab">
              <a-icon type="setting" />系统维护
            </template>
            <system-manage v-if="activeKey === '4'"/>
          </a-tab-pane>
          <a-tab-pane key="5">
            <template slot="tab">
              <a-icon type="audit" />授权信息
            </template>
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
