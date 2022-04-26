import TabsView from '@/layouts/tabs/TabsView'



// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'translate',
          name: '翻译',
          meta: {
            invisible: true,
          },
          component: () => import('@/pages/translate'),
        },
        {
          path: 'activation',
          name: '激活',
          meta: {
            invisible: true,
          },
          component: () => import('@/pages/activation'),
        },
        {
          path: '/systemAvailable',
          name: '系统状态初始化或异常检测',
          meta: {
            invisible: true,
          },
          component: () => import('@/pages/systemAvailable/ServerStatusCheck'),
        },
        {
          path: '/admin',
          name: '用户管理',
          meta: {
            invisible: true,
          },
          component: () => import('@/pages/admin'),
        },
        {
          path: '/self',
          name: '个人中心',
          meta: {
            invisible: true,
          },
          component: () => import('@/pages/self'),
        },
        {
          path: '/ban',
          meta: {
            invisible: true,
          },
          component: () => import('@/pages/admin/BanSuccess.vue'),
        },
      ]
    },
  ]
}

export default options
