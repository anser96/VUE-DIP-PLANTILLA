<template>
    <header class="p-4 bg-gray-200 dark:bg-gray-800 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-700 dark:text-white">Hotel Dashboard</h1>
      <button @click="toggleDarkMode" class="p-2 bg-gray-300 dark:bg-gray-700 rounded-full">
        <span v-if="isDarkMode">☀️</span>
        <span v-else>🌙</span>
      </button>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  defineProps<{
    toggleDarkMode: () => void
  }>()
  
  const isDarkMode = ref(false);
  </script>
  