import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/index.vue'
import Login from './components/login.vue'
import Users from './components/users/users.vue'
import Roles from './components/rights/roles.vue'
import Rights from './components/rights/rights.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
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
      component: Index,
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights }
      ]
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
