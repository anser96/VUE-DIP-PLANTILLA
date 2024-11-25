<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div class="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <h1 class="text-4xl font-bold text-error mb-4">Acceso Denegado</h1>
        <p class="mb-4">No tienes permiso para acceder a esta página.</p>
        <button @click="goToHome" class="btn btn-primary">Regresar al Inicio</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToHome = () => {
    router.push('/'); // Redirige al index (home)
  };
  </script>
  
  <style scoped>
  /* Opcional: estilos adicionales si se necesita */
  </style>
  