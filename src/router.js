import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/index.vue'
import Login from './components/login.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 只要是locaStorage中有令牌或者要去登录页面的放行,其他一律不通过,直接取登录页面
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
