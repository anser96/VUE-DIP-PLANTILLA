<template>
  <aside class="menu p-4 w-64 bg-base-100 text-base-content">
    <ul class="menu">
      <!-- Enlace a Dashboard -->
      <li class="mb-4">
        <a 
          href="/" 
          :class="getLinkClass('/')"
          >Dashboard</a>
      </li>
      
      <!-- Enlace a Tasks -->
      <li class="mb-4">
        <a 
          href="/tasks" 
          :class="getLinkClass('/tasks')"
          >Tasks</a>
      </li>
      
      <!-- Enlace a Requests -->
      <li class="mb-4">
        <a 
          href="/requests" 
          :class="getLinkClass('/requests')"
          >Requests</a>
      </li>
      
      <!-- Enlace a Sessions -->
      <li class="mb-4">
        <a 
          href="/sessions" 
          :class="getLinkClass('/sessions')"
          >Sessions</a>
      </li>
      
      <!-- Agrega más enlaces a otras secciones -->
    </ul>
  </aside>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

// Función para obtener clases dinámicas basadas en la ruta actual
const getLinkClass = (path: string) => {
  // Si la ruta actual coincide con el 'path', agregar clases de botón activo
  return route.path === path 
    ? 'bg-primary text-primary-content hover:bg-primary'  // Estilo para ruta activa
    : 'hover:bg-primary';  // Estilo por defecto con hover
}
</script>

<style scoped>
/* Estilos adicionales */
.menu li a {
  transition: background-color 0.3s ease;  /* Animación suave para el hover */
}
</style>
