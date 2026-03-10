import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'

const routes = [
  { path: '/', redirect: '/setup' },
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
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/ResultView.vue'),
    meta: { requiresAuth: true, requiresTask: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const store = useAppStore()
  if (to.name === 'Setup' && store.hasApiKey) return { name: 'Generator' }
  if (to.meta.requiresAuth && !store.hasApiKey) return { name: 'Setup' }
  if (to.meta.requiresTask && !store.hasTask) return { name: 'Generator' }
})

export default router
