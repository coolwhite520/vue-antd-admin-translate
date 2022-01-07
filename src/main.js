import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import QRCode from 'qrcode'
// import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

Vue.prototype.$copy =(content)=>{
  if (window.clipboardData) {
    window.clipboardData.setData('text', content);
  } else {
    (function(s) {
      document.oncopy = function(e) {
        e.clipboardData.setData('text',  s);
        e.preventDefault();
        document.oncopy = null;
      }
    })(content);
    document.execCommand('Copy');
  }
}


Vue.prototype.$GenerateQR = async text => {
  try {
    return await QRCode.toDataURL(text)
  } catch (err) {
    console.error(err)
  }
}

Vue.prototype.$amountRule =(num)=>{
  if (num > 1000) {
    num = num + "";
    let result = '';
    let str = ',';
    while (num.length > 3) {
      result = str + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
  }
  return num
}

bootstrap({router, store, i18n, message: Vue.prototype.$message})

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
