<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 dark:bg-base-100">
    <!-- Título de Registro -->
    <div class="hero bg-base-100 rounded-lg shadow-md mb-8">
      <div class="hero-content text-center">
        <div class="max-w-lg">
          <h1 class="text-5xl font-bold text-primary dark:text-primary-content">¡Regístrate en MeetUpPro!</h1>
        </div>
      </div>
    </div>

    <!-- Tarjeta de Registro -->
    <div class="w-full max-w-md p-8 space-y-6 bg-base-100 dark:bg-base-300 shadow-md rounded-lg">
      <h2 class="text-center text-3xl font-bold text-base-content dark:text-white">Crear una Cuenta</h2>
      <form @submit.prevent="submitRegister" class="space-y-4">
        <!-- Campo de Nombre -->
        <div>
          <label for="nombre" class="block text-sm font-medium text-base-content dark:text-gray-200">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="user.nombre"
            class="input input-bordered w-full"
            :class="{'input-error': errors.nombre}"
            placeholder="Ingrese su nombre"
            required
          />
          <p v-if="errors.nombre" class="text-error text-sm mt-1">{{ errors.nombre }}</p>
        </div>

        <!-- Campo de Email -->
        <div>
          <label for="correo" class="block text-sm font-medium text-base-content dark:text-gray-200">Correo</label>
          <input
            type="email"
            id="correo"
            v-model="user.correo"
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
            v-model="user.contrasena"
            class="input input-bordered w-full"
            :class="{'input-error': errors.contrasena}"
            placeholder="Ingrese su contraseña"
            required
          />
          <p v-if="errors.contrasena" class="text-error text-sm mt-1">{{ errors.contrasena }}</p>
        </div>

        <!-- Botón de Registro -->
        <div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </div>
      </form>

      <!-- Mensaje de Error -->
      <p v-if="authError" class="text-error text-sm text-center mt-4">{{ authError }}</p>

      <!-- Enlace a Iniciar Sesión -->
      <p class="text-center mt-4 text-base-content dark:text-gray-300">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="text-primary dark:text-primary-content">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../../services/authService';
import { useAuthStore } from '../../store/auth';

// Datos del formulario de registro
const user = ref({
  nombre: '',
  correo: '',
  contrasena: ''
});

// Errores de validación
const errors = ref({
  nombre: '',
  correo: '',
  contrasena: ''
});

// Estado de carga y mensaje de error
const loading = ref(false);
const authError = ref('');

// Instancia de router
const router = useRouter();

// Validar los campos del formulario
const validateFields = () => {
  let isValid = true;
  errors.value.nombre = '';
  errors.value.correo = '';
  errors.value.contrasena = '';

  if (!user.value.nombre) {
    errors.value.nombre = 'El nombre es obligatorio.';
    isValid = false;
  }
  if (!user.value.correo) {
    errors.value.correo = 'El correo es obligatorio.';
    isValid = false;
  }
  if (!user.value.contrasena) {
    errors.value.contrasena = 'La contraseña es obligatoria.';
    isValid = false;
  }

  return isValid;
};

// Enviar el formulario de registro
const submitRegister = async () => {
  if (!validateFields()) return;

  loading.value = true;
  try {
    await register(user.value);
    router.push('/login'); // Redirigir al login después de un registro exitoso
  } catch (error: any) {
    authError.value = error.message || 'Error al registrar el usuario.';
  } finally {
    loading.value = false;
  }
};
// Instancia del store de autenticación
const authStore = useAuthStore();
onMounted(() => {
  if (authStore.token) {
    router.push('/'); // Redirigir al home si ya hay un token
  }
});
</script>

<style scoped>

</style>
