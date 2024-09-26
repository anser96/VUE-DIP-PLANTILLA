<template>
    <header class="p-4 bg-gray-200 dark:bg-gray-800 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-700 dark:text-white">Mi Aplicación</h1>
      <button @click="toggleDarkMode" class="p-2 bg-gray-300 dark:bg-gray-700 rounded-full">
        <span v-if="isDarkMode">☀️</span>
        <span v-else>🌙</span>
      </button>
    </header>
  </template>
  
  <script setup>
  defineProps(['toggleDarkMode'])
  </script>
  