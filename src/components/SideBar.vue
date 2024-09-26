<template>
    <div class="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-lg p-2 overflow-y-auto border-r border-gray-300 dark:border-gray-700">
      <!-- Título -->
      <div class="text-2xl font-bold text-gray-800 dark:text-white px-4 mb-6">
        Hoteles
      </div>
      
      <!-- Menú de navegación -->
      <div class="space-y-3">
        <!-- Crear Hoteles -->
        <div class="px-4">
          <router-link 
            to="/hotel-crear"
            class="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 transition-colors duration-300 shadow">
            Crear Hoteles
          </router-link>
        </div>
        
        <!-- Listado de Hoteles -->
        <div class="px-4">
          <router-link 
            to="/hotel-listado"
            class="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 transition-colors duration-300 shadow">
            Listado
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Puedes agregar estilos adicionales aquí si es necesario */
  </style>
  