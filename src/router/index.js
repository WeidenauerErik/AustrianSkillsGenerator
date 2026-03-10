import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'

const routes = [
  {
    path: '/',
    redirect: '/setup'
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/views/SetupView.vue')
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('@/views/GeneratorView.vue'),
    meta: { requiresAuth: true }
  }
  // TODO: add result view
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const store = useAppStore()

  if (to.name === 'Setup' && store.hasApiKey) {
    return { name: 'Generator' }
  }

  if (to.meta.requiresAuth && !store.hasApiKey) {
    return { name: 'Setup' }
  }
})

export default router
