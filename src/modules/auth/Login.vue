<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 dark:bg-base-100">
    <!-- Título de Bienvenida -->
    <div class="hero bg-base-100 rounded-lg shadow-md mb-8">
      <div class="hero-content text-center">
        <div class="max-w-lg">
          <h1 class="text-5xl font-bold text-primary dark:text-primary-content">¡Bienvenido a MeetUpPro!</h1>
        </div>
      </div>
    </div>

    <!-- Tarjeta de Login -->
    <div class="w-full max-w-md p-8 space-y-6 bg-base-100 dark:bg-base-300 shadow-md rounded-lg">
      <h2 class="text-center text-3xl font-bold text-base-content dark:text-white">Iniciar Sesión</h2>
      <form @submit.prevent="submitLogin" class="space-y-4">
        <!-- Campo de Correo -->
        <div>
          <label for="correo" class="block text-sm font-medium text-base-content dark:text-gray-200">Correo</label>
          <input
            type="email"
            id="correo"
            v-model="credentials.correo"
            class="input input-bordered w-full"
            :class="{'input-error': errors.correo}"
            placeholder="Ingrese su correo electrónico"
            required
          />
          <p v-if="errors.correo" class="text-error text-sm mt-1">{{ errors.correo }}</p>
        </div>

        <!-- Campo de Contraseña -->
        <div>
          <label for="contrasena" class="block text-sm font-medium text-base-content dark:text-gray-200">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            v-model="credentials.contrasena"
            class="input input-bordered w-full"
            :class="{'input-error': errors.contrasena}"
            placeholder="Ingrese su contraseña"
            required
          />
          <p v-if="errors.contrasena" class="text-error text-sm mt-1">{{ errors.contrasena }}</p>
        </div>

        <!-- Botón de Login -->
        <div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>

      <!-- Olvidé mi contraseña -->
      <p class="text-center mt-4">
        <router-link to="/forgot-password" class="text-primary dark:text-primary-content">¿Olvidaste tu contraseña?</router-link>
      </p>

      <!-- Enlace a Registro -->
      <p class="text-center mt-4 text-base-content dark:text-gray-300">
        ¿No tienes una cuenta?
        <router-link to="/register" class="text-primary dark:text-primary-content">Regístrate aquí</router-link>
      </p>

      <!-- Mensaje de Error -->
      <p v-if="authError" class="text-error text-sm text-center mt-4">{{ authError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoginData } from '../../Utils/Interfaces/AuthInterface';
import { useAuthStore } from '../../store/auth';

// Datos del formulario de login
const credentials = ref<LoginData>({
  correo: '',
  contrasena: ''
});

// Errores de validación
const errors = ref({
  correo: '',
  contrasena: ''
});

// Mensaje de error de autenticación
const authError = ref('');
const loading = ref(false);

// Instancia de router
const router = useRouter();

// Instancia del store de autenticación
const authStore = useAuthStore();
onMounted(() => {
  if (authStore.token) {
    router.push('/'); // Redirigir al home si ya hay un token
  }
});
const validateFields = () => {
  let isValid = true;
  errors.value.correo = '';
  errors.value.contrasena = '';

  if (!credentials.value.correo) {
    errors.value.correo = 'El correo electrónico es obligatorio.';
    isValid = false;
  }
  if (!credentials.value.contrasena) {
    errors.value.contrasena = 'La contraseña es obligatoria.';
    isValid = false;
  }
  return isValid;
};

const submitLogin = async () => {
  if (!validateFields()) {
    return;
  }

  loading.value = true;
  try {
    // Llamar al método de login del store
    await authStore.login(credentials.value);
    router.push('/'); // Redirigir después de iniciar sesión
  } catch (error) {
    authError.value = 'Correo o contraseña incorrectos.';
  } finally {
    loading.value = false;
  }
};
</script>
