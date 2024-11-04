<template>
  <div :class="{ 'dark': isDarkMode }" class="flex flex-col h-screen bg-base-100 dark:bg-base-300 overflow-hidden">
    <!-- Header Component -->
    <Header :toggleDarkMode="toggleDarkMode" :isDarkMode="isDarkMode" />
    
    <div class="grid grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-[auto_1fr] h-full overflow-hidden">
  <!-- Sidebar solo en pantallas grandes -->
  <SideBar v-show="!isSidebarCollapsed" class="hidden md:block h-full md:col-span-1" />

  <!-- Contenedor principal -->
  <div :class="{ 'md:ml-16': isSidebarCollapsed }" class="flex flex-col w-full transition-all duration-300 ">
    <!-- Main Content Area -->
    <main class="flex-1 p-6 md:p-12 overflow-y-auto bg-base-200 dark:bg-base-300 text-base-content dark:text-gray-100 shadow-md max-h-screen">
      <Breadcrumb />
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
import Breadcrumb from './BreadCrumb.vue';
import Footer from './Footer.vue';

const isDarkMode = ref<boolean>(false);
const isSidebarCollapsed = ref<boolean>(false);

function toggleDarkMode(): void {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dim');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'emerald');
    localStorage.setItem('theme', 'light');
  }
}

function toggleSidebarCollapse() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDarkMode.value = savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme === 'dark' ? 'dim' : 'emerald');
});
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
