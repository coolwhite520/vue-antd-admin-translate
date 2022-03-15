<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
<!--      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar"/>-->
      <a-avatar class="avatar" style="backgroundColor:#87d068" icon="user" />
      <span class="name">{{user.name}}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="handleClickSelfCenter">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item v-if="user.isSuper" @click="handleClickAdmin" :disabled="user.pwdValidator.length > 0">
        <a-icon type="setting" />
        <span>系统管理</span>
      </a-menu-item>
      <a-menu-item @click="handleClickJumpHome" :disabled="user.pwdValidator.length > 0">
        <a-icon type="arrow-left" />
        <span>返回首页</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import {mapGetters} from 'vuex'
import {logout} from '@/services/user'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      logout(this.user.user_id)
      this.$router.push('/login')
    },
    handleClickAdmin() {
      if (this.$route.path === "/systemAvailable") {
        this.$message.warning("当前正在进行系统初始化，请稍后。")
        return
      }
      if (this.$route.path === "/admin") {
        this.$router.go(0)
      } else {
        this.$router.push('/admin')
      }
    },
    handleClickJumpHome() {
      if (this.$route.path === "/systemAvailable") {
        this.$message.warning("当前正在进行系统初始化，请稍后。")
        return
      }
      if (this.$route.path === "/translate") {
        this.$router.go(0)
      } else {
        this.$router.push('/translate')
      }
    },
    handleClickSelfCenter() {
      if (this.$route.path === "/systemAvailable") {
        this.$message.warning("当前正在进行系统初始化，请稍后。")
        return
      }
      if (this.$route.path === "/self") {
        this.$router.go(0)
      } else {
        this.$router.push('/self')
      }
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
