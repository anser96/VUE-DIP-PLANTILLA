<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">Editar Solicitud</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para la Dependencia -->
        <div>
          <label for="dependencia" class="block text-sm font-medium text-gray-700">Dependencia</label>
          <input
            type="text"
            id="dependencia"
            v-model="newSolicitud.dependencia"
            class="input input-bordered w-full"
            placeholder="Ingrese la dependencia"
            required
          />
          <p v-if="errors.dependencia" class="text-red-500 text-sm mt-1">{{ errors.dependencia }}</p>
        </div>
  
        <!-- Campo para el Asunto -->
        <div>
          <label for="asunto" class="block text-sm font-medium text-gray-700">Asunto</label>
          <input
            type="text"
            id="asunto"
            v-model="newSolicitud.asunto"
            class="input input-bordered w-full"
            placeholder="Ingrese el asunto"
            required
          />
          <p v-if="errors.asunto" class="text-red-500 text-sm mt-1">{{ errors.asunto }}</p>
        </div>
  
        <!-- Campo para la Decisión -->
        <div>
          <label for="desicion" class="block text-sm font-medium text-gray-700">Decisión</label>
          <input
            type="text"
            id="desicion"
            v-model="newSolicitud.desicion"
            class="input input-bordered w-full"
            placeholder="Ingrese la decisión"
            required
          />
          <p v-if="errors.desicion" class="text-red-500 text-sm mt-1">{{ errors.desicion }}</p>
        </div>
  
        <!-- Campo para la Fecha de Solicitud -->
        <div>
          <label for="fechaDeSolicitud" class="block text-sm font-medium text-gray-700">Fecha de Solicitud</label>
          <input
            type="date"
            id="fechaDeSolicitud"
            v-model="newSolicitud.fechaDeSolicitud"
            class="input input-bordered w-full"
            required
          />
          <p v-if="errors.fechaDeSolicitud" class="text-red-500 text-sm mt-1">{{ errors.fechaDeSolicitud }}</p>
        </div>
  
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">Actualizar Solicitud</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { updateSolicitud, getSolicitudById } from '../../services/solicitudServices';
  
  // Datos de la solicitud que se está editando
  const newSolicitud = ref({
    dependencia: '',
    asunto: '',
    desicion: '',
    fechaDeSolicitud: '',
  });
  
  // Gestión de errores de formulario
  const errors = ref({
    dependencia: '',
    asunto: '',
    desicion: '',
    fechaDeSolicitud: '',
  });
  
  // Detectar si estamos en modo de edición
  const router = useRouter();
  const route = useRoute();
  const solicitudId = ref<number | null>(null);
  
  onMounted(async () => {
    solicitudId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  
    if (solicitudId.value !== null) {
      try {
        const response = await getSolicitudById(solicitudId.value);
        newSolicitud.value = { ...response }; 
        console.log('Solicitud cargada:', newSolicitud.value);
      } catch (error) {
        console.error('Error al cargar la solicitud:', error);
      }
    }
  });
  
  const validateFields = () => {
    let isValid = true;
  
    // Limpiar errores anteriores
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof typeof errors.value] = '';
    });
  
    // Validar campos
    if (!newSolicitud.value.dependencia) {
      errors.value.dependencia = 'La dependencia es obligatoria.';
      isValid = false;
    }
  
    if (!newSolicitud.value.asunto) {
      errors.value.asunto = 'El asunto es obligatorio.';
      isValid = false;
    }
  
    if (!newSolicitud.value.desicion) {
      errors.value.desicion = 'La decisión es obligatoria.';
      isValid = false;
    }
  
    if (!newSolicitud.value.fechaDeSolicitud) {
      errors.value.fechaDeSolicitud = 'La fecha de solicitud es obligatoria.';
      isValid = false;
    }
  
    return isValid;
  };
  
  const submitForm = async () => {
    if (!validateFields()) return;
  
    try {
      if (solicitudId.value !== null) {
        await updateSolicitud(solicitudId.value, newSolicitud.value);
        router.push('/requests'); // Redirigir a la lista de solicitudes
      }
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
    }
  };
  </script>
  
  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
  