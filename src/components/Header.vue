<template>
  <header class="navbar bg-primary dark:bg-primary-focus text-white shadow-md">
    <!-- Título de la aplicación -->
    <div class="flex-1">
      <h1 class="text-xl font-bold px-4">MeetUpPro</h1>
    </div>

    <!-- Botón para cambiar el modo oscuro/claro -->
    <button @click="toggleDarkMode" class="btn btn-ghost btn-circle">
      <template v-if="isDarkMode">
        <!-- Icono de Sol para Modo Claro -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </template>
      <template v-else>
        <!-- Icono de Luna para Modo Oscuro -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </template>
    </button>

    <!-- Información del usuario y opciones en pantallas grandes -->
    <div class="hidden md:flex items-center gap-4">
      <span v-if="authStore.usuario" class="text-sm font-medium">
        Bienvenido, {{ authStore.usuario.nombre }}
      </span>
      <button @click="logout" class="btn btn-ghost text-sm font-medium text-white flex items-center gap-2">
        <ArrowRightEndOnRectangleIcon class="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>

    <!-- Menú desplegable para el usuario en pantallas pequeñas -->
    <div class="md:hidden flex items-center">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost">
          <span v-if="authStore.usuario" class="text-sm font-medium">{{ authStore.usuario.nombre }}</span>
          <ArrowDownIcon class="w-5 h-5 ml-1" />
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 dark:bg-base-200 rounded-box z-[1] w-48 p-2 shadow">
          <li><button @click="logout" class="flex items-center gap-2 text-black">
            <ArrowRightEndOnRectangleIcon class="w-5 h-5" />
            Cerrar Sesión
          </button></li>
        </ul>
      </div>
    </div>

    <!-- Botón de menú para abrir el sidebar en pantallas pequeñas -->
    <div class="flex-none md:hidden">
      <button @click="toggleSidebar" class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>
    </div>

    <!-- Sidebar en pantallas pequeñas, con clase de visibilidad -->
    <div :class="{ 'translate-x-0': showSidebar, '-translate-x-full': !showSidebar }"
      class="fixed top-0 left-0 w-64 h-full bg-base-200 text-base-content shadow-lg transform transition-transform duration-300 z-40 md:hidden">
      <SideBar />
    </div>
  </header>

  <!-- Fondo oscuro para cerrar el sidebar al hacer clic fuera de él -->
  <div v-if="showSidebar" @click="toggleSidebar" class="fixed inset-0 bg-black opacity-50 z-30 md:hidden"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideBar from './SideBar.vue';
import { useAuthStore } from '../store/auth'; // Ruta ajustada según tu proyecto
import { storeToRefs } from 'pinia';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline';
import { ArrowDownIcon } from '@heroicons/vue/24/solid';

// Props recibidos para modo oscuro y función de cambio
const props = defineProps<{ toggleDarkMode: () => void; isDarkMode: boolean }>();

const showSidebar = ref(false);
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Autenticación y función de cierre de sesión
const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
/* Ajustes de transición */
</style>
