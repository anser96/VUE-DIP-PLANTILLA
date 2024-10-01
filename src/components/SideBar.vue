<template>
  <aside class="menu p-4 w-64 bg-base-100 text-base-content">
    <ul class="menu">
      <!-- Mostrar las rutas principales -->
      <template v-for="route in sidebarRoutes" :key="route.path">
        <li v-if="route.meta?.isChild === false && route.meta?.showInSidebar === true" class="mb-4">
          <!-- Renderizar la ruta padre si no es un subnivel y tiene `showInSidebar: true` -->
          <router-link
            :to="route.path"
            :class="getLinkClass(route.path)"
          >
            {{ route.meta?.breadcrumb }}
          </router-link>

          <!-- Mostrar subniveles (hijos) si existen y tienen `showInSidebar: true` y `isChild: true` -->
          <ul v-if="route.children && route.children.some((child: RouteRecordRaw) => child.meta?.showInSidebar && child.meta?.isChild)" class="pl-4">
            <li
              v-for="childRoute in route.children.filter((child: RouteRecordRaw) => child.meta?.showInSidebar && child.meta?.isChild)"
              :key="childRoute.path"
              class="mb-2"
            >
              <!-- Renderizar la ruta hijo (subnivel) -->
              <router-link
                :to="concatPath(route.path, childRoute.path)"
                :class="getLinkClass(concatPath(route.path, childRoute.path))"
              >
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
