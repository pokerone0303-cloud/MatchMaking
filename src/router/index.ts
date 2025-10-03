import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 公用路由
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: '登入',
        role: 'public',
      }
    },
    {
      path: '/test-slide-nav',
      name: 'test-slide-nav',
      component: () => import('@/views/TestSlideNav.vue'),
    },
    {
      path: '/test-app',
      name: 'test-app',
      component: () => import('@/views/TestApp.vue'),
    },
    // 用戶端路由
    {
      path: '/u',
      name: 'User',
      redirect: '/u/shifts',
      children: [
        {
          path: '/u/shifts',
          name: 'UserShifts',
          component: () => import('@/views/User/UserShiftsView.vue'),
        },
        {
          path: '/u/profile',
          name: 'UserProfile',
          component: () => import('@/views/User/UserProfileView.vue'),
        },
      ]
    },
    // {
    //   path: '/u/timesheets',
    //   name: 'timesheets',
    //   component: () => import('@/views/UserTimesheets.vue'),
    // },
    // {
    //   path: '/u/applications',
    //   name: 'applications',
    //   component: () => import('@/views/UserApplications.vue'),
    // }
    // 商家端路由
    // 管理端路由
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
