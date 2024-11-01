<script setup lang="ts">
import router from './router';
import { useAuthStore } from './store/auth';
import './assets/style.css';

const authStore = useAuthStore();
authStore.loadToken(); // Cargar el token al iniciar

// Verificar si el token existe en el store y si es válido
if (!authStore.$state.token) {
  // Si no hay token o no es válido, redirigir al login
  router.push('/login');
  localStorage.removeItem('auth'); // Elimina la clave 'auth' en lugar de 'token'
}
</script>

<template>
  <!-- El router-view carga rutas públicas y protegidas -->
  <router-view />
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
