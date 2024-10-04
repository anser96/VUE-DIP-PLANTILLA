<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Miembro' : 'Crear Nuevo Miembro' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="newMember.name"
            class="input input-bordered w-full"
            placeholder="Ingrese el nombre"
            required
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>
  
        <!-- Campo para el Cargo -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            id="role"
            v-model="newMember.role"
            class="input input-bordered w-full"
            placeholder="Ingrese el cargo"
            required
          />
          <p v-if="errors.role" class="text-red-500 text-sm mt-1">{{ errors.role }}</p>
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Miembro' : 'Crear Miembro' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de miembros simulados
  const members = ref([
    { idMember: 1, name: 'Juan Pérez', role: 'Presidente' },
    { idMember: 2, name: 'María López', role: 'Secretario' }
  ]);
  
  // Datos del nuevo miembro
  const newMember = ref({
    name: '',
    role: ''
  });
  
  const errors = ref({
    name: '',
    role: ''
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const memberId = ref<number | null>(null);
  
  // Si es modo edición, cargar los datos del miembro existente
  onMounted(() => {
    memberId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = memberId.value !== null;
  
    if (isEditing.value && memberId.value !== null) {
      const member = members.value.find(m => m.idMember === memberId.value);
      if (member) {
        newMember.value = { ...member };
      }
    }
  });
  
  const validateFields = () => {
    let isValid = true;
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof typeof errors.value] = '';
    });
  
    if (!newMember.value.name) {
      errors.value.name = 'El nombre es obligatorio.';
      isValid = false;
    }
  
    if (!newMember.value.role) {
      errors.value.role = 'El cargo es obligatorio.';
      isValid = false;
    }
  
    return isValid;
  };
  
  const submitForm = () => {
    if (!validateFields()) {
      return;
    }
  
    if (isEditing.value && memberId.value !== null) {
      // Actualizar miembro existente
      const index = members.value.findIndex(member => member.idMember === memberId.value);
      if (index !== -1) {
        members.value[index] = { idMember: memberId.value, ...newMember.value };
      }
    } else {
      // Crear nuevo miembro
      const newId = members.value.length + 1;
      members.value.push({ idMember: newId, ...newMember.value });
    }
  
    router.push('/members');
  };
  </script>
  
  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
  