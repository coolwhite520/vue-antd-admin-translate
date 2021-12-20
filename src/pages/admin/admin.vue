<template>
  <div>
    <a-row>
      <a-col :xs="0" :sm="0" :md="3" :lg="3" :xl="3">
        &nbsp;
      </a-col>
      <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <a-tabs default-active-key="0">
          <a-tab-pane key="0" tab="用户管理">
            <user-manage/>
          </a-tab-pane>
          <a-tab-pane key="1" tab="维护">
            <system-manage/>
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
export default {
  name: "admin",
  components: {SystemManage, UserManage},
}
</script>

<style scoped>

</style>
