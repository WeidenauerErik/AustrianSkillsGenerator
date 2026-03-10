import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'

const routes = [
  {
    path: '/',
    redirect: () => {
      // Will be resolved by navigation guard
      return '/setup'
    }
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/views/SetupView.vue'),
    meta: { title: 'API-Einrichtung' }
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('@/views/GeneratorView.vue'),
    meta: { title: 'Generator', requiresAuth: true }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/ResultView.vue'),
    meta: { title: 'Ergebnis', requiresAuth: true, requiresTask: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' })
})

// Navigation guards
router.beforeEach((to) => {
  const store = useAppStore()

  // Redirect to generator if API key exists and going to setup
  if (to.name === 'Setup' && store.hasApiKey) {
    return { name: 'Generator' }
  }

  // Require API key for protected routes
  if (to.meta.requiresAuth && !store.hasApiKey) {
    return { name: 'Setup' }
  }

  // Require task data for result page
  if (to.meta.requiresTask && !store.hasTask) {
    return { name: 'Generator' }
  }
})

export default router
