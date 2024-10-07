<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Tema de Sesión' : 'Crear Nuevo Tema de Sesión' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el Tema -->
        <div>
          <label for="tema" class="block text-sm font-medium text-gray-700">Tema</label>
          <input
            type="text"
            id="tema"
            v-model="order.TEMA"
            class="input input-bordered w-full"
            placeholder="Ingrese el tema"
            required
          />
        </div>
  
        <!-- Campo para la Descripción -->
        <div>
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            id="descripcion"
            v-model="order.DESCRIPCION"
            class="input input-bordered w-full"
            placeholder="Ingrese la descripción"
            required
          />
        </div>
  
        <!-- Campo para el ID de Sesión -->
        <div>
          <label for="sesionId" class="block text-sm font-medium text-gray-700">ID de Sesión</label>
          <input
            type="number"
            id="sesionId"
            v-model="order.SESION_IDSESION"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la sesión"
            required
            :disabled="isEditing"
          />
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Tema' : 'Crear Tema' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de órdenes de sesión simuladas
  const sessionOrders = ref([
    { TEMA: 'Presupuesto Anual', DESCRIPCION: 'Discusión sobre el presupuesto anual', SESION_IDSESION: 1 },
    { TEMA: 'Evaluación del Proyecto X', DESCRIPCION: 'Revisión del estado del Proyecto X', SESION_IDSESION: 2 }
  ]);
  
  // Datos del orden de la sesión
  const order = ref({
    TEMA: '',
    DESCRIPCION: '',
    SESION_IDSESION: 0
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const orderId = ref<number | null>(null);
  
  // Si es modo edición, cargar los datos de la sesión existente
  onMounted(() => {
    orderId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = orderId.value !== null;
  
    if (isEditing.value && orderId.value !== null) {
      const existingOrder = sessionOrders.value.find(o => o.SESION_IDSESION === orderId.value);
      if (existingOrder) {
        order.value = { ...existingOrder };
      }
    }
  });
  
  const submitForm = () => {
    if (isEditing.value && orderId.value !== null) {
      // Actualizar orden existente
      const index = sessionOrders.value.findIndex(o => o.SESION_IDSESION === orderId.value);
      if (index !== -1) {
        sessionOrders.value[index] = { ...order.value };
      }
    } else {
      // Crear nuevo orden de sesión
      sessionOrders.value.push({ ...order.value });
    }
    router.push('/session-order');
  };
  </script>
  
  <style scoped>
  .input {
    margin-top: 4px;
  }
  </style>
  