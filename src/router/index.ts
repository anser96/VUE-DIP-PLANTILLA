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
    meta: { 
      allowedRoles: [
        'ESTUDIANTE',
        'INVITADO',
        'INTEGRANTECOMITE',
        'ADMINISTRADOR',
        'SECRETARIO',
        'DOCENTE',
        'PRESIDENTE',
        'MODERADOR'
      ]
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const userRole = authStore.usuario?.rol;
  
  // Verificar si la ruta tiene roles permitidos definidos y si el usuario está autenticado
  const hasAllowedRoles = Array.isArray(to.meta.allowedRoles);

  if (hasAllowedRoles) {
    console.log('Ruta con roles permitidos:', to.meta.allowedRoles);
    // Si la ruta tiene `allowedRoles` definidos, verificar si el usuario tiene un rol permitido
    if (userRole && (to.meta.allowedRoles as string[]).includes(userRole)) {
      next(); // Permitir acceso si el rol está permitido
    } else {
      // Si el rol no es permitido, establecer `showInSidebar` en falso y redirigir
      to.meta.showInSidebar = false;
      next('/acceso-denegado'); // O redirigir a una página específica de acceso denegado
    }
  } else if (isAuthenticated) {
    // Si no hay restricciones de rol, permitir el acceso si el usuario está autenticado
    next();
  } else {
    // Si la ruta no requiere roles específicos y el usuario no está autenticado, continuar la navegación
    next();
  }
});
export default router;
