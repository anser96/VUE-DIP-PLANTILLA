import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';
import { useAuthStore } from '../store/auth';
import AppLayout from '../components/AppLayout.vue';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  {
    path: '/',
    component: AppLayout,
    children: protectedRoutes,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token ;

  if (to.meta.requiresAuth && !isAuthenticated) {
    authStore.$reset();
    next('/login');
  } else {
    next();
  }
});

export default router;
