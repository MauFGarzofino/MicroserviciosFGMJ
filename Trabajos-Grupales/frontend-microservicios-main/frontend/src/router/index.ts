// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types/auth'

const routes = [
  {
    path: '/auth/login',
    name: 'auth.login',
    component: () => import('@/views/AuthLogin.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true, roles: ['admin'] as Role[] },
  },
  {
    path: '/auth/register',
    name: 'AuthRegister',
    component: () => import('@/views/AuthRegister.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin/users/new',
    name: 'admin.user.add',
    component: () => import('@/views/AdminUserAdd.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin.home',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/events',
    name: 'admin.events',
    component: () => import('@/views/AdminEvents.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users/new',
    name: 'admin.user.add',
    component: () => import('@/views/AdminUserAdd.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.userId) {
    // al recargar F5, hidrata desde el token en localStorage
    await auth.hydrateFromStorage()
  }

  const needAuth = to.matched.some((r) => r.meta?.requiresAuth)
  const guestOnly = to.matched.some((r) => r.meta?.guestOnly)
  const roles = (to.meta?.roles as Role[] | undefined) ?? []

  if (needAuth && !auth.isAuthenticated) {
    return { name: 'auth.login', query: { redirect: to.fullPath } }
  }
  if (guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }
  if (roles.length && !auth.hasRole(roles)) {
    return { name: 'home' } // o crea /403
  }

  return true
})
// src/router/index.ts (en beforeEach)
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.userId) {
    try {
      await auth.hydrateFromStorage()
    } catch {}
  }

  // si entra a Home y es admin -> mándalo al panel
  if (to.name === 'home' && auth.role === 'admin') {
    return { name: 'admin' }
  }

  // ... tu lógica de requiresAuth/guestOnly/roles
  return true
})

export default router
