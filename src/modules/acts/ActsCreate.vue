<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Acta' : 'Crear Nueva Acta' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el Número de Acta -->
        <div>
          <label for="numActas" class="block text-sm font-medium text-gray-700">Número de Acta</label>
          <input
            type="number"
            id="numActas"
            v-model="acta.NUM_ACTAS"
            class="input input-bordered w-full"
            placeholder="Ingrese el número de acta"
            required
            :disabled="isEditing"
          />
        </div>
  
        <!-- Campo para el Estado -->
        <div>
          <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
          <input
            type="text"
            id="estado"
            v-model="acta.ESTADO"
            class="input input-bordered w-full"
            placeholder="Ingrese el estado del acta"
            required
          />
        </div>
  
        <!-- Campo para el ID de Sesión -->
        <div>
          <label for="sesionId" class="block text-sm font-medium text-gray-700">ID de Sesión</label>
          <input
            type="number"
            id="sesionId"
            v-model="acta.SESION_IDSESION"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la sesión"
            required
          />
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Acta' : 'Crear Acta' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de actas simuladas
  const actas = ref([
    { NUM_ACTAS: 101, ESTADO: 'FIRMADA', SESION_IDSESION: 1 },
    { NUM_ACTAS: 102, ESTADO: 'EN PROCESO', SESION_IDSESION: 2 },
    { NUM_ACTAS: 103, ESTADO: 'FIRMADA', SESION_IDSESION: 3 }
  ]);
  
  // Datos de la acta
  const acta = ref({
    NUM_ACTAS: 0,
    ESTADO: '',
    SESION_IDSESION: 0
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const actaId = ref<number | null>(null);
  
  // Si es modo edición, cargar los datos de la acta existente
  onMounted(() => {
    actaId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = actaId.value !== null;
  
    if (isEditing.value && actaId.value !== null) {
      const existingActa = actas.value.find(a => a.NUM_ACTAS === actaId.value);
      if (existingActa) {
        acta.value = { ...existingActa };
      }
    }
  });
  
  const submitForm = () => {
    if (isEditing.value && actaId.value !== null) {
      // Actualizar acta existente
      const index = actas.value.findIndex(a => a.NUM_ACTAS === actaId.value);
      if (index !== -1) {
        actas.value[index] = { ...acta.value };
      }
    } else {
      // Crear nueva acta
      actas.value.push({ ...acta.value });
    }
    router.push('/acts');
  };
  </script>
  
  <style scoped>
  .input {
    margin-top: 4px;
  }
  </style>
  