<template>
    <div :class="theme">
      <div class="drawer drawer-mobile">
        <!-- Sidebar -->
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
          <!-- Header -->
          <header class="navbar bg-base-100 shadow-md">
            <div class="flex-none lg:hidden">
              <label for="my-drawer" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </label>
            </div>
            <div class="flex-1 px-2 mx-2">My Application</div>
            <div class="flex-none">
              <button @click="toggleTheme" class="btn btn-ghost">
                <span v-if="isDarkMode">☀️</span>
                <span v-else>🌙</span>
              </button>
            </div>
          </header>
  
          <!-- Main Content -->
          <main class="p-4">
            <slot />
          </main>
  
          <!-- Footer -->
          <footer class="footer footer-center p-4 bg-base-300 text-base-content">
            <div>
              <p>© 2024 My Application - All rights reserved</p>
            </div>
          </footer>
        </div>
  
        <!-- Sidebar -->
        <div class="drawer-side">
          <label for="my-drawer" class="drawer-overlay"></label>
          <aside class="menu p-4 w-80 bg-base-200 text-base-content">
            <ul class="menu">
              <li><a href="/">Home</a></li>
              <li><a href="/tasks">Tasks</a></li>
              <li><a href="/requests">Requests</a></li>
              <!-- Agrega más enlaces según tus módulos -->
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const theme = ref('autumn'); // Tema por defecto
  const isDarkMode = ref(false);
  
  // Función para alternar el modo claro/oscuro
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    theme.value = isDarkMode.value ? 'luxury' : 'autumn';
  };
  </script>
  
  <style scoped>
  </style>
  