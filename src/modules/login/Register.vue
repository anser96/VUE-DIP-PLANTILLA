<template>
    <div class="flex items-center justify-center card bg-base-100 shadow-lg">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 class="text-center text-3xl font-bold">Regístrate</h2>
        <form @submit.prevent="submitRegister" class="space-y-4">
          <!-- Campo de Nombre -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="name"
              v-model="user.name"
              class="input input-bordered w-full"
              placeholder="Ingrese su nombre"
              required
            />
          </div>
  
          <!-- Campo de Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="user.email"
              class="input input-bordered w-full"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </div>
  
          <!-- Campo de Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="user.password"
              class="input input-bordered w-full"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
  
          <!-- Botón de Registro -->
          <div>
            <button type="submit" class="btn btn-primary w-full">Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const user = ref({
    name: '',
    email: '',
    password: ''
  });
  
  const router = useRouter();
  
  const submitRegister = () => {
    // Aquí agregarías la lógica para registrar un nuevo usuario.
    // Después de un registro exitoso, puedes redirigir al usuario:
    router.push('/login');
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
  