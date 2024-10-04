<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Proposición' : 'Crear Nueva Proposición' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para la Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            id="description"
            v-model="newProposition.description"
            class="input input-bordered w-full"
            placeholder="Ingrese la descripción"
            required
          />
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>
  
        <!-- Campo para la Decisión -->
        <div>
          <label for="decision" class="block text-sm font-medium text-gray-700">Decisión</label>
          <input
            type="text"
            id="decision"
            v-model="newProposition.decision"
            class="input input-bordered w-full"
            placeholder="Ingrese la decisión"
            required
          />
          <p v-if="errors.decision" class="text-red-500 text-sm mt-1">{{ errors.decision }}</p>
        </div>
  
        <!-- Campo para el Miembro -->
        <div>
          <label for="memberId" class="block text-sm font-medium text-gray-700">ID del Miembro</label>
          <input
            type="number"
            id="memberId"
            v-model="newProposition.memberId"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID del miembro"
            required
          />
          <p v-if="errors.memberId" class="text-red-500 text-sm mt-1">{{ errors.memberId }}</p>
        </div>
  
        <!-- Campo para la Sesión -->
        <div>
          <label for="sessionId" class="block text-sm font-medium text-gray-700">ID de la Sesión</label>
          <input
            type="number"
            id="sessionId"
            v-model="newProposition.sessionId"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la sesión"
            required
          />
          <p v-if="errors.sessionId" class="text-red-500 text-sm mt-1">{{ errors.sessionId }}</p>
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Proposición' : 'Crear Proposición' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de proposiciones simuladas
  const propositions = ref([
    { idProposition: 1, description: 'Propuesta 1', decision: 'Aprobada', memberId: 1, sessionId: 1 },
    { idProposition: 2, description: 'Propuesta 2', decision: 'Rechazada', memberId: 2, sessionId: 2 }
  ]);
  
  // Datos de la nueva proposición
  const newProposition = ref({
    description: '',
    decision: '',
    memberId: 0,
    sessionId: 0,
  });
  
  const errors = ref({
    description: '',
    decision: '',
    memberId: '',
    sessionId: ''
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const propositionId = ref<number | null>(null);
  
  // Si es modo edición, cargar los datos de la proposición existente
  onMounted(() => {
    propositionId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = propositionId.value !== null;
  
    if (isEditing.value && propositionId.value !== null) {
      const proposition = propositions.value.find(p => p.idProposition === propositionId.value);
      if (proposition) {
        newProposition.value = { ...proposition };
      }
    }
  });
  
  const validateFields = () => {
    let isValid = true;
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof typeof errors.value] = '';
    });
  
    if (!newProposition.value.description) {
      errors.value.description = 'La descripción es obligatoria.';
      isValid = false;
    }
  
    if (!newProposition.value.decision) {
      errors.value.decision = 'La decisión es obligatoria.';
      isValid = false;
    }
  
    if (!newProposition.value.memberId || newProposition.value.memberId <= 0) {
      errors.value.memberId = 'El ID del miembro es obligatorio y debe ser mayor que 0.';
      isValid = false;
    }
  
    if (!newProposition.value.sessionId || newProposition.value.sessionId <= 0) {
      errors.value.sessionId = 'El ID de la sesión es obligatorio y debe ser mayor que 0.';
      isValid = false;
    }
  
    return isValid;
  };
  
  const submitForm = () => {
    if (!validateFields()) {
      return;
    }
  
    if (isEditing.value && propositionId.value !== null) {
      // Actualizar proposición existente
      const index = propositions.value.findIndex(p => p.idProposition === propositionId.value);
      if (index !== -1) {
        propositions.value[index] = { idProposition: propositionId.value, ...newProposition.value };
      }
    } else {
      // Crear nueva proposición
      const newId = propositions.value.length + 1;
      propositions.value.push({ idProposition: newId, ...newProposition.value });
    }
  
    router.push('/propositions');
  };
  </script>
  
  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
  