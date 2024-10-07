<template>
    <div class="flex items-center justify-center card bg-base-100 shadow-lg">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 class="text-center text-3xl font-bold">Recuperar Contraseña</h2>
        <form @submit.prevent="submitForgotPassword" class="space-y-4">
          <!-- Campo de Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="input input-bordered w-full"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </div>
  
          <!-- Botón para recuperar contraseña -->
          <div>
            <button type="submit" class="btn btn-primary w-full">Recuperar Contraseña</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const email = ref('');
  
  const submitForgotPassword = () => {
    // Aquí agregarías la lógica para recuperar la contraseña.
    alert(`Se ha enviado un enlace de recuperación al correo: ${email.value}`);
  };
  </script>
  
  <style scoped>
  .btn {
    background-color: #1d4ed8;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }
  .btn:hover {
    background-color: #2563eb;
  }
  .input {
    border: 1px solid #d1d5db;
    padding: 0.5rem;
    border-radius: 0.375rem;
  }
  </style>
  