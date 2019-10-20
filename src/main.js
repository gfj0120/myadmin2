import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器  请求时带上token
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 响应数据时做的事情
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  response = response.data
  if (response.meta.status === 401) {
    router.push('/login')
    response.meta.msg = '登录异常,请重新登录'
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
