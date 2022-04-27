import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import QRCode from 'qrcode'
import {pinyin} from 'pinyin-pro';

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
var passwordValidator = require('password-validator');
var generator = require('generate-password');
const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
  /*
   * eg:format="YYYY-MM-dd hh:mm:ss";
   */
  var o = {
    "M+" :this.getMonth() + 1, // month
    "d+" :this.getDate(), // day
    "h+" :this.getHours(), // hour
    "m+" :this.getMinutes(), // minute
    "s+" :this.getSeconds(), // second
    "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
    "S" :this.getMilliseconds()
    // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "")
        .substr(4 - RegExp.$1.length));
  }

  for ( var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
          : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}



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

// 声明一个全局的密码验证函数
Vue.prototype.$PasswordValidator = (password) => {
  let schema = new passwordValidator();
  schema
      .is().min(12, "最小输入12个字符")                                    // Minimum length 8
      .is().max(100, "最大输入100个字符")                                  // Maximum length 100
      .has().uppercase(1, "至少包含一个大写字母")                              // Must have uppercase letters
      .has().lowercase(1, "至少包含一个小写字母")                              // Must have lowercase letters
      .has().digits(1, "至少包含一个数字")                                // Must have at least 2 digits
      .has().symbols(1, "至少包含一个特殊符号")
      .has().not().spaces(1, "不能包含空格")
      // .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
  return schema.validate(password, { details: true });
}

Vue.prototype.$Convert2Pinyin = (str) => {
  let py_name = pinyin(str, {toneType: 'none'});
  return py_name.replaceAll(" ", "");
}

Vue.prototype.$GeneratePwd = () => {
  let password = generator.generate({
    length: 12,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    exclude:`"",''.;:/[](){}`,
    excludeSimilarCharacters: true,
    strict: true,
  });
  return password
}

bootstrap({router, store, i18n, message: Vue.prototype.$message})

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
