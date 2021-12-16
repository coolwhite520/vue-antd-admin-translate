<template>
  <div>
    我是翻译记录
  </div>
</template>

<script>

import {mapState} from 'vuex'


export default {
  name: 'WorkPlace',
  components: { },
  i18n: require('./i18n'),
  data () {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {

  }
}
</script>

<style lang="less">
@import "src/pages/translate/index";
</style>
