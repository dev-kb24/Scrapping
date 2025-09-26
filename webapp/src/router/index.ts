import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/layout/MainLayout.vue'),
      children:[
          {
          path: '/',
          name: 'Dashboard',
          component: () => import("@/views/Dashboard.vue"),
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: 'entreprises',
          name: 'Entreprises',
          component: () => import("@/views/Business.vue"),
           meta: {
            title: 'Entreprises'
          }
        },
        {
          path: 'entreprises/kanban',
          name: 'EntreprisesKanban',
          component: () => import("@/views/BusinessKanban.vue"),
          meta: {
            title: 'Entreprises - Vue Kanban'
          }
        },
        {
          path: 'scrape',
          name: 'scrape',
          component: () => import("@/views/Scrape.vue"),
           meta: {
            title: 'Scrape'
          }
        },
        {
          path: 'email',
          name: 'email',
          component: () => import("@/views/Email.vue"),
           meta: {
            title: 'Email'
          }
        },
        {
          path: 'site-creator',
          name: 'site-creator',
          component: () => import("@/views/SiteCreator.vue"),
           meta: {
            title: 'Site Creator'
          }
        },
        {
          path: 'template',
          name: 'template',
          component: () => import("@/views/Template.vue"),
          meta: {
            title: 'Template'
          }
        },
      ]
    }
  ],
})

export default router
