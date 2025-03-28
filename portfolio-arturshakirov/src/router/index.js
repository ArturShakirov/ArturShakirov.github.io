import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/appView.vue'),
    },
    {
      path: '/politicas',
      name: 'Politicas',
      children: [
        {
          path: 'privacidad',
          name: 'PoliticasPrivacidad',
          component: () => import('@/views/politicaPrivacidadView.vue'),
        },
        {
          path: 'cookies',
          name: 'PoliticasCookies',
          component: () => import('@/views/politicaCookiesView.vue'),
        },
/*         {
          path: 'terminos-y-condiciones',
          name: 'PoliticasTerminosYCondiciones',
          component: () => import('@/views/politicasTerminosYCondicionesView.vue'),
        }, */
      ],
    }
  ],
})

export default router
