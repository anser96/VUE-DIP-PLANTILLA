<template>
  <div class="p-4 space-y-8">
    <!-- Bienvenida -->
    <div class="hero bg-base-100 rounded-lg shadow-md">
      <div class="hero-content text-center">
        <div class="max-w-lg">
          <h1 class="text-5xl font-bold">¡Bienvenido a ConcordApp!</h1>
          <p class="py-6">
            Este es tu centro principal para gestionar sesiones, tareas y solicitudes. Navega por la aplicación usando los siguientes enlaces.
          </p>
        </div>
      </div>
    </div>

    <!-- Accesos rápidos a secciones principales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1: Sesiones -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">Gestionar Sesiones</h2>
          <p>Visualiza, crea y gestiona tus sesiones fácilmente.</p>
          <div class="card-actions justify-end">
            <a href="/sessions" class="btn btn-primary">Ir a Sesiones</a>
          </div>
        </div>
      </div>

      <!-- Card 2: Tareas -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">Gestionar Tareas</h2>
          <p>Rastrea las tareas y actividades relacionadas con tus sesiones.</p>
          <div class="card-actions justify-end">
            <a href="/tasks" class="btn btn-primary">Ir a Tareas</a>
          </div>
        </div>
      </div>

      <!-- Card 3: Solicitudes -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">Gestionar Solicitudes</h2>
          <p>Gestiona las solicitudes y envíos relacionados con tus sesiones.</p>
          <div class="card-actions justify-end">
            <a href="/requests" class="btn btn-primary">Ir a Solicitudes</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
