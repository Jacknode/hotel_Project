// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import '@/assets/css/reset.css'
import '@/assets/css/animate.css'
import '@/assets/css/icons/icomoon/styles.css'
import 'element-ui/lib/theme-chalk/index.css'
import loading from './components/loading'
import VueRouter from 'vue-router'
import routes from './routes'
import store from './store'
import * as filters from './filters'

// 遍历所有导出的过滤器并添加到全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
})

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(loading);

const router = new VueRouter({routes})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('qianKeName');
//   }
//   let user = JSON.parse(sessionStorage.getItem('qianKeName'));
//   if (!user && to.path != '/login') {
//     next({path: '/login'})
//   } else {
//     next()
//   }
// })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  filters,
  template: '<App/>',
  components: { App }
})
