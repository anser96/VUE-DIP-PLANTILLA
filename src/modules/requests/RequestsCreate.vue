<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Solicitud' : 'Crear Nueva Solicitud' }}</h1>
  
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
  
        <!-- Campo para el ID del Solicitante 
        <div>
          <label for="solicitanteId" class="block text-sm font-medium text-gray-700">ID Solicitante</label>
          <input
            type="number"
            id="solicitanteId"
            v-model="newSolicitud.solicitanteId"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID del solicitante"
            required
          />
          <p v-if="errors.solicitanteId" class="text-red-500 text-sm mt-1">{{ errors.solicitanteId }}</p>
        </div>
  
         Campo para el ID de la Sesión 
        <div>
          <label for="sesionId" class="block text-sm font-medium text-gray-700">ID Sesión</label>
          <input
            type="number"
            id="sesionId"
            v-model="newSolicitud.sesionId"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la sesión"
            required
          />
          <p v-if="errors.sesionId" class="text-red-500 text-sm mt-1">{{ errors.sesionId }}</p>
        </div>
  
         Campo para el ID de la Descripción 
        <div>
          <label for="descripcionId" class="block text-sm font-medium text-gray-700">ID Descripción</label>
          <input
            type="number"
            id="descripcionId"
            v-model="newSolicitud.descripcionId"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la descripción"
            required
          />
          <p v-if="errors.descripcionId" class="text-red-500 text-sm mt-1">{{ errors.descripcionId }}</p>
        </div>-->
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Solicitud' : 'Crear Solicitud' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de solicitudes (simuladas para prueba)
  const solicitudes = ref([
    { idSolicitud: 1, dependencia: 'Departamento de Finanzas', asunto: 'Aprobación de Presupuesto', desicion: 'Aprobado', fechaDeSolicitud: '2024-09-25', solicitanteId: 1001, sesionId: 1, descripcionId: 2001 },
    { idSolicitud: 2, dependencia: 'Recursos Humanos', asunto: 'Solicitud de Vacaciones', desicion: 'Pendiente', fechaDeSolicitud: '2024-10-01', solicitanteId: 1002, sesionId: 2, descripcionId: 2002 }
  ]);
  
  // Datos de la nueva solicitud
  const newSolicitud = ref({
    dependencia: '',
    asunto: '',
    desicion: '',
    fechaDeSolicitud: '',
    solicitanteId: 0,
    sesionId: 0,
    descripcionId: 0,
  });
  
  // Gestión de errores de formulario
  const errors = ref({
    dependencia: '',
    asunto: '',
    desicion: '',
    fechaDeSolicitud: '',
    solicitanteId: '',
    sesionId: '',
    descripcionId: '',
  });
  
  // Detectar si estamos en modo de edición
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const solicitudId = ref<number | null>(null);
  
  onMounted(() => {
    solicitudId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = solicitudId.value !== null;
  
    if (isEditing.value && solicitudId.value !== null) {
      // Cargar los datos de la solicitud a editar
      const solicitud = solicitudes.value.find(s => s.idSolicitud === solicitudId.value);
      if (solicitud) {
        newSolicitud.value = { ...solicitud };
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
  
    if (!newSolicitud.value.solicitanteId || newSolicitud.value.solicitanteId <= 0) {
      errors.value.solicitanteId = 'El ID del solicitante es obligatorio y debe ser mayor a 0.';
      isValid = false;
    }
  
    if (!newSolicitud.value.sesionId || newSolicitud.value.sesionId <= 0) {
      errors.value.sesionId = 'El ID de la sesión es obligatorio y debe ser mayor a 0.';
      isValid = false;
    }
  
    if (!newSolicitud.value.descripcionId || newSolicitud.value.descripcionId <= 0) {
      errors.value.descripcionId = 'El ID de la descripción es obligatorio y debe ser mayor a 0.';
      isValid = false;
    }
  
    return isValid;
  };
  
  const submitForm = () => {
    if (!validateFields()) {
      return;
    }
  
    if (isEditing.value && solicitudId.value !== null) {
      // Actualizar solicitud existente
      const index = solicitudes.value.findIndex(solicitud => solicitud.idSolicitud === solicitudId.value);
      if (index !== -1) {
        solicitudes.value[index] = { idSolicitud: solicitudId.value, ...newSolicitud.value };
      }
    } else {
      // Crear nueva solicitud
      const newId = solicitudes.value.length + 1;
      solicitudes.value.push({ idSolicitud: newId, ...newSolicitud.value });
    }
  
    router.push('/requests');
  };
  </script>
  
  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
  