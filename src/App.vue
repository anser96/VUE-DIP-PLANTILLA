<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import HeaderPage from './components/HeaderPage.vue'
import SideBar from './components/SideBar.vue'

// Control del modo oscuro
const isDarkMode = ref<boolean>(false)

function toggleDarkMode(): void {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div :class="{'dark': isDarkMode}" class="flex flex-col h-screen">
    <HeaderPage :toggleDarkMode="toggleDarkMode" />
    <div class="flex flex-1 overflow-hidden bg-white dark:bg-gray-900">
      <SideBar />
      <main class="flex-1 px-4 py-8 md:px-12 md:py-12 overflow-y-auto bg-gray-100 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-md">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
