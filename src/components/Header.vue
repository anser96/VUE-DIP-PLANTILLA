<template>
  <header class="navbar bg-primary dark:bg-primary-focus text-white shadow-md">
    <div class="flex-1">
      <h1 class="text-xl font-bold px-4">MeetUpPro</h1>
    </div>
    <div class="flex-none flex items-center gap-4">
      <!-- Mostrar el nombre del usuario que inició sesión -->
      <span v-if="authStore.usuario" class="text-sm font-medium">
        Bienvenido, {{ authStore.usuario.nombre }}
      </span>

      <!-- Control de tema con checkbox e íconos de sol y luna -->
      <label class="flex cursor-pointer gap-2 items-center">
        <!-- Sol -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          />
        </svg>

        <!-- Checkbox para alternar el tema -->
        <input
          type="checkbox"
          :checked="isDarkMode"
          @change="toggleDarkMode"
          class="toggle theme-controller"
        />

        <!-- Luna -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </label>

      <!-- Botón de Logout -->
      <button @click="logout" class="btn btn-ghost text-sm font-medium text-white">
        Cerrar Sesión
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../store/auth';

// Props para alternar el modo oscuro
const props = defineProps<{ toggleDarkMode: () => void, isDarkMode: boolean }>();

const toggleDarkMode = () => {
  props.toggleDarkMode();
};

// Obtener el store de autenticación y las propiedades reactivas
const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore); // Acceder al usuario autenticado

// Llamar a la acción de logout en el store de autenticación
const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
</style>
