<script setup lang="ts">
import router from './router';
import { useAuthStore } from './store/auth';
import './assets/style.css';

const authStore = useAuthStore();
authStore.$patch({ token: localStorage.getItem('token') });
if (!authStore.$state.token) {
  // Si no hay token o no es válido, redirigir al login
  router.push('/login');
}

</script>

<template>
  <!-- El router-view carga rutas públicas y protegidas -->
  <router-view />
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
