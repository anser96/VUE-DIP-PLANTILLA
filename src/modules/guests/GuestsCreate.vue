<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Invitado' : 'Crear Nuevo Invitado' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="newGuest.name"
            class="input input-bordered w-full"
            placeholder="Ingrese el nombre"
            required
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>
  
        <!-- Campo para la Dependencia -->
        <div>
          <label for="dependency" class="block text-sm font-medium text-gray-700">Dependencia</label>
          <input
            type="text"
            id="dependency"
            v-model="newGuest.dependency"
            class="input input-bordered w-full"
            placeholder="Ingrese la dependencia"
            required
          />
          <p v-if="errors.dependency" class="text-red-500 text-sm mt-1">{{ errors.dependency }}</p>
        </div>
  
        <!-- Campo para el Cargo -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            id="role"
            v-model="newGuest.role"
            class="input input-bordered w-full"
            placeholder="Ingrese el cargo"
            required
          />
          <p v-if="errors.role" class="text-red-500 text-sm mt-1">{{ errors.role }}</p>
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Invitado' : 'Crear Invitado' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de invitados simulados
  const guests = ref([
    { idGuest: 1, name: 'Carlos Martínez', dependency: 'Departamento de Física', role: 'Investigador' },
    { idGuest: 2, name: 'Ana Gómez', dependency: 'Departamento de Biología', role: 'Jefe de Proyecto' }
  ]);
  
  // Datos del nuevo invitado
  const newGuest = ref({
    name: '',
    dependency: '',
    role: ''
  });
  
  const errors = ref({
    name: '',
    dependency: '',
    role: ''
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const guestId = ref<number | null>(null);
  
  // Si es modo edición, cargar los datos del invitado existente
  onMounted(() => {
    guestId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = guestId.value !== null;
  
    if (isEditing.value && guestId.value !== null) {
      const guest = guests.value.find(g => g.idGuest === guestId.value);
      if (guest) {
        newGuest.value = { ...guest };
      }
    }
  });
  
  const validateFields = () => {
    let isValid = true;
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof typeof errors.value] = '';
    });
  
    if (!newGuest.value.name) {
      errors.value.name = 'El nombre es obligatorio.';
      isValid = false;
    }
  
    if (!newGuest.value.dependency) {
      errors.value.dependency = 'La dependencia es obligatoria.';
      isValid = false;
    }
  
    if (!newGuest.value.role) {
      errors.value.role = 'El cargo es obligatorio.';
      isValid = false;
    }
  
    return isValid;
  };
  
  const submitForm = () => {
    if (!validateFields()) {
      return;
    }
  
    if (isEditing.value && guestId.value !== null) {
      // Actualizar invitado existente
      const index = guests.value.findIndex(guest => guest.idGuest === guestId.value);
      if (index !== -1) {
        guests.value[index] = { idGuest: guestId.value, ...newGuest.value };
      }
    } else {
      // Crear nuevo invitado
      const newId = guests.value.length + 1;
      guests.value.push({ idGuest: newId, ...newGuest.value });
    }
  
    router.push('/guests');
  };
  </script>
  
  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
  