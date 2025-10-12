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
        {
          path: '/u/timesheets',
          name: 'UserTimesheets',
          component: () => import('@/views/User/UserTimesheetsView.vue'),
        },
        {
          path: '/u/applications',
          name: 'UserApplications',
          component: () => import('@/views/User/UserApplicationsView.vue'),
        },
      ]
    },
    // 商家端路由
    {
      path: '/e',
      name: 'Employer',
      redirect: '/e/shifts',
      children: [
        {
          path: '/e/shifts',
          name: 'EmployerShifts',
          component: () => import('@/views/Employer/EmployerShiftsView.vue'),
        },
        {
          path: '/e/create',
          name: 'EmployerCreate',
          component: () => import('@/views/Employer/EmployerCreateView.vue'),
        },
        {
          path: '/e/applicants',
          name: 'EmployerApplicants',
          component: () => import('@/views/Employer/EmployerApplicantsView.vue'),
        },
        {
          path: '/e/profile',
          name: 'EmployerProfile',
          component: () => import('@/views/Employer/EmployerProfileView.vue'),
        },
        {
          path: '/e/statistics',
          name: 'EmployerStatistics',
          component: () => import('@/views/Employer/EmployerStatisticsView.vue'),
        },
        {
          path: '/e/stores',
          name: 'EmployerStores',
          component: () => import('@/views/Employer/EmployerStoresView.vue'),
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
