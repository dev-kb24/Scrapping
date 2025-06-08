import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import Business from '@/views/Business.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
      children:[
          {
          path: '',
          name: 'Dashboard',
          component: Dashboard,
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: 'entreprises',
          name: 'Entreprises',
          component: Business,
           meta: {
            title: 'Entreprises'
          }
        }
      ]
    }
  ],
})

export default router
