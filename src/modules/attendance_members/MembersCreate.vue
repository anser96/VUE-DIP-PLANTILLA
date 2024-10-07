<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Asistencia de Miembro' : 'Registrar Nueva Asistencia de Miembro' }}</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el ID de Sesión -->
        <div>
          <label for="sesId" class="block text-sm font-medium text-gray-700">ID de Sesión</label>
          <input
            type="number"
            id="sesId"
            v-model="attendance.SESION_IDSESION"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la sesión"
            required
            :disabled="isEditing"
          />
        </div>
  
        <!-- Campo para el ID del Miembro -->
        <div>
          <label for="memberId" class="block text-sm font-medium text-gray-700">ID del Miembro</label>
          <input
            type="number"
            id="memberId"
            v-model="attendance.MIEMBROS_IDMIEMBRO"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID del miembro"
            required
            :disabled="isEditing"
          />
        </div>
  
        <!-- Campo para el Estado de Asistencia -->
        <div>
          <label for="attendanceState" class="block text-sm font-medium text-gray-700">Estado de Asistencia</label>
          <select
            id="attendanceState"
            v-model="attendance.ESTADO_ASISTENCIA"
            class="input input-bordered w-full"
            required
          >
            <option value="ASISTIO">Asistió</option>
            <option value="NO ASISTIO">No Asistió</option>
          </select>
        </div>
  
        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Asistencia' : 'Registrar Asistencia' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // Lista de asistencias simuladas
  const attendances = ref([
    { SESION_IDSESION: 1, MIEMBROS_IDMIEMBRO: 101, ESTADO_ASISTENCIA: 'ASISTIO' },
    { SESION_IDSESION: 2, MIEMBROS_IDMIEMBRO: 102, ESTADO_ASISTENCIA: 'NO ASISTIO' }
  ]);
  
  // Datos del nuevo o existente asistencia
  const attendance = ref({
    SESION_IDSESION: 0,
    MIEMBROS_IDMIEMBRO: 0,
    ESTADO_ASISTENCIA: 'ASISTIO'
  });
  
  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const attendanceId = ref<{ SESION_IDSESION: number; MIEMBROS_IDMIEMBRO: number }>({
    SESION_IDSESION: 0,
    MIEMBROS_IDMIEMBRO: 0
  });
  
  // Si es modo edición, cargar los datos de la asistencia existente
  onMounted(() => {
    attendanceId.value.SESION_IDSESION = route.params.sesId ? parseInt(route.params.sesId as string, 10) : 0;
    attendanceId.value.MIEMBROS_IDMIEMBRO = route.params.memberId ? parseInt(route.params.memberId as string, 10) : 0;
    
    isEditing.value = attendanceId.value.SESION_IDSESION !== 0 && attendanceId.value.MIEMBROS_IDMIEMBRO !== 0;
  
    if (isEditing.value) {
      const existingAttendance = attendances.value.find(
        a => a.SESION_IDSESION === attendanceId.value.SESION_IDSESION && a.MIEMBROS_IDMIEMBRO === attendanceId.value.MIEMBROS_IDMIEMBRO
      );
      if (existingAttendance) {
        attendance.value = { ...existingAttendance };
      }
    }
  });
  
  const submitForm = () => {
    if (isEditing.value) {
      const index = attendances.value.findIndex(
        a => a.SESION_IDSESION === attendance.value.SESION_IDSESION && a.MIEMBROS_IDMIEMBRO === attendance.value.MIEMBROS_IDMIEMBRO
      );
      if (index !== -1) {
        attendances.value[index] = { ...attendance.value };
      }
    } else {
      attendances.value.push({ ...attendance.value });
    }
    router.push('/attendance-members');
  };
  </script>
  
  <style scoped>
  .input {
    margin-top: 4px;
  }
  </style>
  