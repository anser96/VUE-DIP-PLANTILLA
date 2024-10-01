<template>
  <nav class="text-sm breadcrumbs p-4 bg-primary rounded-lg shadow-md">
    <ul class="flex space-x-2">
      <!-- Iterar sobre los breadcrumbs -->
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">

        <!-- Si es el último crumb, no es un enlace -->
        <span v-if="index === breadcrumbs.length - 1" class="font-semibold  dark:text-white text-black">
          {{ crumb.meta.breadcrumb }}
        </span>

        <!-- Si no es el último, es un enlace -->
        <a v-else :href="crumb.path" class=" hover:underline dark:text-white text-black">
          {{ crumb.meta.breadcrumb }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Obtener la ruta actual usando Vue Router
const route = useRoute();

// Crear un array de breadcrumbs basado en la ruta actual y sus padres
const breadcrumbs = computed(() => {
  // Filtrar rutas que tengan un meta.breadcrumb
  return route.matched.filter((r) => r.meta && r.meta.breadcrumb);
});
</script>

<style scoped>
</style>
