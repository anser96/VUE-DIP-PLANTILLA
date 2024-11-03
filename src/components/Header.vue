<template>
  <header class="navbar bg-primary dark:bg-primary-focus text-white shadow-md">
    <div class="flex-1">
      <h1 class="text-xl font-bold px-4">MeetUpPro</h1>
    </div>

    <!-- Botón de menú para abrir el sidebar en pantallas pequeñas -->
    <div class="flex-none md:hidden">
      <button @click="toggleSidebar" class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Sidebar en pantallas pequeñas, con clase de visibilidad -->
  <div :class="{ 'translate-x-0': showSidebar, '-translate-x-full': !showSidebar }" 
       class="fixed top-0 left-0 w-64 h-full bg-base-200 text-base-content shadow-lg transform transition-transform duration-300 z-40 md:hidden">
    <SideBar />
  </div>

  <!-- Fondo oscuro para cerrar el sidebar al hacer clic fuera de él -->
  <div v-if="showSidebar" @click="toggleSidebar" class="fixed inset-0 bg-black opacity-50 z-30 md:hidden"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideBar from './SideBar.vue';

const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
</script>

<style scoped>
/* Ajustes de transición */
</style>
