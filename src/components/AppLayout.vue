<template>
    <div :class="{'dark': isDarkMode}" class="flex flex-col h-screen">
      <!-- Header Component -->
      <Header :toggleDarkMode="toggleDarkMode" :isDarkMode="isDarkMode"/>
  
      <div class="flex flex-1 overflow-hidden bg-base-100">
        <!-- Sidebar Component -->
        <SideBar />
  
        <!-- Main Content -->
        <div class="flex flex-col w-full">
          <!-- Main Content Area -->
          <main class="flex-1 px-4 py-2 md:px-12 md:py-4 overflow-y-auto bg-base-100 dark:bg-base-300 text-base-content dark:text-gray-100 shadow-md">
            <!-- Breadcrumb Component -->
            <Breadcrumb />
            <!-- El router-view aquí permite que se carguen las rutas principales y las hijas -->
            <router-view />
          </main>
  
          <!-- Footer Component -->
          <Footer />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Header from './Header.vue';
  import SideBar from './SideBar.vue';
  import Breadcrumb from './Breadcrumb.vue';
  import Footer from './Footer.vue';
  
  // Control del modo oscuro
  const isDarkMode = ref<boolean>(false);
  
  // Función para alternar el modo oscuro
  function toggleDarkMode(): void {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.documentElement.setAttribute('data-theme', 'dim');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'emerald');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  
  // Leer el tema desde localStorage al cargar la aplicación
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      isDarkMode.value = true;
      document.documentElement.setAttribute('data-theme', 'dim');
      document.documentElement.classList.add('dark');
    } else {
      isDarkMode.value = false;
      document.documentElement.setAttribute('data-theme', 'emerald');
      document.documentElement.classList.remove('dark');
    }
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si los necesitas */
  </style>
  