<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Solicitante' : 'Crear Nuevo Solicitante' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="newApplicant.name"
            class="input input-bordered w-full"
            placeholder="Ingrese el nombre"
            required
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>
  
        <!-- Campo para el Tipo de Solicitante -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Tipo de Solicitante</label>
          <input
            type="text"
            id="type"
            v-model="newApplicant.type"
            class="input input-bordered w-full"
            placeholder="Ingrese el tipo de solicitante"
            required
          />
          <p v-if="errors.type" class="text-red-500 text-sm mt-1">{{ errors.type }}</p>
        </div>
  
        <!-- Campo para el Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="newApplicant.email"
            class="input input-bordered w-full"
            placeholder="Ingrese el correo electrónico"
            required
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>
  
        <!-- Campo para el Celular -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">Celular</label>
          <input
            type="text"
            id="phone"
            v-model="newApplicant.phone"
            class="input input-bordered w-full"
            placeholder="Ingrese el número de celular"
            required
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Solicitante' : 'Crear Solicitante' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de solicitantes simulados
  const applicants = ref([
    { idApplicant: 1, name: 'Carlos González', type: 'Estudiante', email: 'carlos@correo.com', phone: '123456789' },
    { idApplicant: 2, name: 'Ana Martínez', type: 'Profesional', email: 'ana@correo.com', phone: '987654321' }
  ]);
  
  // Datos del nuevo solicitante
  const newApplicant = ref({
    name: '',
    type: '',
    email: '',
    phone: ''
  });
  
  const errors = ref({
    name: '',
    type: '',
    email: '',
    phone: ''
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const applicantId = ref<number | null>(null);
  
  // Si es modo edición, cargar los datos del solicitante existente
  onMounted(() => {
    applicantId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = applicantId.value !== null;
  
    if (isEditing.value && applicantId.value !== null) {
      const applicant = applicants.value.find(a => a.idApplicant === applicantId.value);
      if (applicant) {
        newApplicant.value = { ...applicant };
      }
    }
  });
  
  const validateFields = () => {
    let isValid = true;
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof typeof errors.value] = '';
    });
  
    if (!newApplicant.value.name) {
      errors.value.name = 'El nombre es obligatorio.';
      isValid = false;
    }
  
    if (!newApplicant.value.type) {
      errors.value.type = 'El tipo de solicitante es obligatorio.';
      isValid = false;
    }
  
    if (!newApplicant.value.email) {
      errors.value.email = 'El email es obligatorio.';
      isValid = false;
    }
  
    if (!newApplicant.value.phone) {
      errors.value.phone = 'El número de celular es obligatorio.';
      isValid = false;
    }
  
    return isValid;
  };
  
  const submitForm = () => {
    if (!validateFields()) {
      return;
    }
  
    if (isEditing.value && applicantId.value !== null) {
      // Actualizar solicitante existente
      const index = applicants.value.findIndex(applicant => applicant.idApplicant === applicantId.value);
      if (index !== -1) {
        applicants.value[index] = { idApplicant: applicantId.value, ...newApplicant.value };
      }
    } else {
      // Crear nuevo solicitante
      const newId = applicants.value.length + 1;
      applicants.value.push({ idApplicant: newId, ...newApplicant.value });
    }
  
    router.push('/applicants');
  };
  </script>
  
  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
  