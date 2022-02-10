import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)
/* Layout */

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'el-icon-s-home' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [
  {
    path: '/monitorManage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'monitorManage',
    meta: { title: '监控预警', icon: 'el-icon-s-data', roles: 'monitorManage' },
    children: [
      {
        path: 'monitor',
        name: 'monitor',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '监控', icon: 'el-icon-s-data' },
        children: [
          {
            path: 'monitorDetail',
            component: () => import('@/views/dashboard/index'),
            name: 'monitorDetail',
            meta: { title: '监控详情', role: 'monitorDetail' }
          },
        ]
      }
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
