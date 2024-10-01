<template>
  <header class="navbar bg-secondary shadow-md">
    <div class="flex-1">
      <h1 class="text-xl font-bold px-4 text-white ">MeetUpPro</h1>
    </div>
    <div class="flex-none">
      <button @click="toggleDarkMode" class="btn btn-ghost">
        <span v-if="isDarkMode">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// Recibe la función para alternar el modo oscuro desde App.vue
const props = defineProps<{ toggleDarkMode: () => void, isDarkMode: boolean }>();

const toggleDarkMode = () => {
  props.toggleDarkMode();
};
</script>

<style scoped>
</style>
