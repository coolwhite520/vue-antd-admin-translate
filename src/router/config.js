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
          path: 'history',
          name: '历史记录',
          meta: {
            invisible: true,
            icon: 'history'
          },
          component: () => import('@/pages/history'),
        },
      ]
    },
  ]
}

export default options
