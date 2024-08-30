import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import http from './utils/request'
import common from './utils/common'
import constant from './utils/constant'
import mavonEditor from 'mavon-editor'

//引入js
import './utils/title'
//引入css
import './assets/css/myglobal.css'
import './assets/css/animation.css'
import './assets/css/index.css'
import './assets/css/tocbot.css'
import './assets/css/color.css'
import './assets/css/markdown-highlight.css'
import './assets/css/font-awesome.min.css'
import 'mavon-editor/dist/css/index.css'

import {vueBaberrage} from 'vue-baberrage'

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.use(vueBaberrage)
Vue.use(mavonEditor)

Vue.prototype.$common = common
Vue.prototype.$http = http
Vue.prototype.$constant = constant

Vue.config.productionTip = false

new Vue({
  router,
  common,
  constant,
  store,
  render: h => h(App)
}).$mount('#app');
