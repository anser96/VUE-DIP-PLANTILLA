<template>
    <div class="p-4 space-y-8">
      <!-- Bienvenida -->
      <div class="hero bg-base-100 rounded-lg shadow-md">
        <div class="hero-content text-center">
          <div class="max-w-lg">
            <h1 class="text-5xl font-bold">¡Bienvenido a MeetUpPro!</h1>
          </div>
        </div>
      </div> 
    </div> 
  
    <div class="flex items-center justify-center card bg-base-100 shadow-lg">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 class="text-center text-3xl font-bold">Iniciar Sesión</h2>
        <form @submit.prevent="submitLogin" class="space-y-4">
          <!-- Campo de Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="credentials.email"
              class="input input-bordered w-full"
              placeholder="Ingrese su correo electrónico"
              required
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>
  
          <!-- Campo de Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="credentials.password"
              class="input input-bordered w-full"
              placeholder="Ingrese su contraseña"
              required
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>
  
          <!-- Botón de Login -->
          <div>
            <button type="submit" class="btn btn-primary w-full">Iniciar Sesión</button>
          </div>
        </form>
  
        <!-- Olvidé mi contraseña -->
        <p class="text-center mt-4">
          <router-link to="/forgot-password" class="text-blue-500">¿Olvidaste tu contraseña?</router-link>
        </p>
  
        <!-- Enlace a Registro -->
        <p class="text-center mt-4">
          ¿No tienes una cuenta?
          <router-link to="/register" class="text-blue-500">Regístrate aquí</router-link>
        </p>
  
        <!-- Mensaje de Error -->
        <p v-if="authError" class="text-red-500 text-sm text-center mt-4">{{ authError }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Datos del formulario de login
  const credentials = ref({
    email: '',
    password: ''
  });
  
  // Errores de validación
  const errors = ref({
    email: '',
    password: ''
  });
  
  // Mensaje de error de autenticación
  const authError = ref('');
  
  // Usar Vue Router para redirigir después de iniciar sesión
  const router = useRouter();
  
  const validateFields = () => {
    let isValid = true;
    // Limpiar errores
    errors.value.email = '';
    errors.value.password = '';
  
    // Validación básica de email y contraseña
    if (!credentials.value.email) {
      errors.value.email = 'El correo electrónico es obligatorio.';
      isValid = false;
    }
    if (!credentials.value.password) {
      errors.value.password = 'La contraseña es obligatoria.';
      isValid = false;
    }
    return isValid;
  };
  
  const submitLogin = () => {
    if (!validateFields()) {
      return;
    }
  
    // Simulación de autenticación (aquí podrías integrar con tu API de autenticación)
    if (credentials.value.email === 'user@example.com' && credentials.value.password === 'password') {
      // Login exitoso: Redirigir a una página protegida (por ejemplo: Dashboard)
      router.push('/dashboard');
    } else {
      // Error de autenticación
      authError.value = 'Correo o contraseña incorrectos.';
    }
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