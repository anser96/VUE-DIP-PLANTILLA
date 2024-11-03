<template>
  <aside class="menu p-4 w-64 h-full bg-base-200 text-base-content overflow-y-auto shadow-lg">
    <ul class="menu">
      <template v-for="route in sidebarRoutes" :key="route.path">
        <li v-if="route.meta?.isChild === false && route.meta?.showInSidebar === true" class="mb-4">
          <div :class="getLinkClass(route.path)">
            <component :is="getIconForRoute(route.path)" class="w-5 h-5 mr-2" />
            <router-link :to="route.path" class="transition-colors duration-200">
              {{ route.meta?.breadcrumb }}
            </router-link>
          </div>

          <ul v-if="route.children && route.children.some((child: RouteRecordRaw) => child.meta?.showInSidebar && child.meta?.isChild)" class="pl-4">
            <li v-for="childRoute in route.children.filter((child: RouteRecordRaw) => child.meta?.showInSidebar && child.meta?.isChild)" :key="childRoute.path" class="mb-2">
              <router-link :to="concatPath(route.path, childRoute.path)" :class="getLinkClass(concatPath(route.path, childRoute.path))">
                {{ childRoute.meta?.breadcrumb }}
              </router-link>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import { computed } from 'vue';
// Importar iconos de Heroicons v2
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UsersIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  BookmarkIcon,
  FolderOpenIcon,
  ClipboardIcon,
  BuildingLibraryIcon,
} from '@heroicons/vue/24/solid';

// Función recursiva para filtrar y asignar el nivel de la ruta, omitiendo aquellas con `showInSidebar: false`
const filterRoutes = (routes: RouteRecordRaw[], level = 0): any[] => {
  return routes
    .filter(route => route.meta?.showInSidebar !== false) // Filtrar rutas que no se deben mostrar
    .map(route => ({
      ...route,
      level, // Agregamos el nivel actual
      children: route.children ? filterRoutes(route.children, level + 1) : [], // Filtrar también los hijos
    }));
};

// Obtener las rutas que se mostrarán en el sidebar
const router = useRouter();
const sidebarRoutes = computed(() => {
  const routes = router.getRoutes().filter(route => route.meta?.showInSidebar !== false);
  return filterRoutes(routes); // Filtrar y asignar niveles a las rutas
});

// Obtener la ruta actual para aplicar clases dinámicas
const route = useRoute();
const getLinkClass = (path: string): string => {
  const baseClass = 'text-black dark:text-white font-bold';
  const activeClass = 'bg-primary text-black dark:text-white font-bold';
  return route.path === path ? activeClass : baseClass;
};

// Concatenar rutas padre e hijo
const concatPath = (parentPath: string, childPath: string): string => {
  return `${parentPath.replace(/\/$/, '')}/${childPath.replace(/^\//, '')}`;
};

// Función para obtener el ícono basado en la ruta
const getIconForRoute = (path: string) => {
  if (path.includes('/attendance')) return UserGroupIcon; // Asistencia
  if (path.includes('/acts')) return DocumentDuplicateIcon; // Actas
  if (path.includes('/tasks')) return ClipboardIcon; // Tareas
  if (path.includes('/requests')) return DocumentTextIcon; // Solicitudes
  if (path.includes('/sessions')) return CalendarDaysIcon; // Sesiones
  if (path.includes('/members')) return UsersIcon; // Miembros
  if (path.includes('/applicants')) return AcademicCapIcon; // Solicitantes
  if (path.includes('/propositions')) return BookmarkIcon; // Proposiciones
  if (path.includes('/descriptions')) return FolderOpenIcon; // Descripciones
  if (path.includes('/task-assignments')) return ClipboardDocumentListIcon; // Encargados de Tareas
  if (path.includes('/session-order')) return BuildingLibraryIcon; // Orden de Sesión
  if (path.includes('/')) return HomeIcon; // Página de inicio
  return null; // Ícono por defecto si no se encuentra
};
</script>

<style scoped>
.menu li a {
  transition: background-color 0.3s ease;
}

/* Añadir margen para subniveles */
.menu ul {
  padding-left: 1rem;
}
</style>
