<template>
  <div :class="{ 'dark': isDarkMode }" class="flex flex-col h-screen bg-base-100 dark:bg-base-300">
    <!-- Header Component -->
    <Header :toggleDarkMode="toggleDarkMode" :isDarkMode="isDarkMode" />

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar Component con toggle de minimización -->
      <SideBar :isCollapsed="isSidebarCollapsed" @toggleCollapse="toggleSidebarCollapse" />

      <!-- Main Content -->
      <div :class="{ 'ml-16': isSidebarCollapsed }" class="flex flex-col w-full transition-all duration-300">
        <!-- Main Content Area -->
        <main class="flex-1 p-6 md:p-12 overflow-y-auto bg-base-200 dark:bg-base-300 text-base-content dark:text-gray-100 shadow-md">
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
import Breadcrumb from './Breadcrumb.vue';
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
