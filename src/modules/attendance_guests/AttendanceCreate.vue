<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Asistencia' : 'Registrar Nueva Asistencia' }}</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para el ID del Invitado -->
      <div>
        <label for="invId" class="block text-sm font-medium text-gray-700">ID Invitado</label>
        <input
          type="number"
          id="invId"
          v-model="attendance.INVITADO_IDINVITADO"
          class="input input-bordered w-full"
          placeholder="Ingrese el ID del invitado"
          required
          :disabled="isEditing"
        />
      </div>

      <!-- Campo para el ID de la Sesión -->
      <div>
        <label for="sesionId" class="block text-sm font-medium text-gray-700">ID de Sesión</label>
        <input
          type="number"
          id="sesionId"
          v-model="attendance.SESION_IDSESION"
          class="input input-bordered w-full"
          placeholder="Ingrese el ID de la sesión"
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
  { INVITADO_IDINVITADO: 111, SESION_IDSESION: 1, ESTADO_ASISTENCIA: 'ASISTIO' },
  { INVITADO_IDINVITADO: 222, SESION_IDSESION: 2, ESTADO_ASISTENCIA: 'NO ASISTIO' }
]);

// Datos del nuevo o existente asistencia
const attendance = ref({
  INVITADO_IDINVITADO: 0,
  SESION_IDSESION: 0,
  ESTADO_ASISTENCIA: 'ASISTIO'
});

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const attendanceId = ref<{ INVITADO_IDINVITADO: number; SESION_IDSESION: number }>({
  INVITADO_IDINVITADO: 0,
  SESION_IDSESION: 0
});

// Si es modo edición, cargar los datos de la asistencia existente
onMounted(() => {
  attendanceId.value.INVITADO_IDINVITADO = route.params.invId ? parseInt(route.params.invId as string, 10) : 0;
  attendanceId.value.SESION_IDSESION = route.params.sesId ? parseInt(route.params.sesId as string, 10) : 0;
  
  isEditing.value = attendanceId.value.INVITADO_IDINVITADO !== 0 && attendanceId.value.SESION_IDSESION !== 0;

  if (isEditing.value) {
    const existingAttendance = attendances.value.find(
      a => a.INVITADO_IDINVITADO === attendanceId.value.INVITADO_IDINVITADO && a.SESION_IDSESION === attendanceId.value.SESION_IDSESION
    );
    if (existingAttendance) {
      attendance.value = { ...existingAttendance };
    }
  }
});

const submitForm = () => {
  if (isEditing.value) {
    const index = attendances.value.findIndex(
      a => a.INVITADO_IDINVITADO === attendance.value.INVITADO_IDINVITADO && a.SESION_IDSESION === attendance.value.SESION_IDSESION
    );
    if (index !== -1) {
      attendances.value[index] = { ...attendance.value };
    }
  } else {
    attendances.value.push({ ...attendance.value });
  }
  router.push('/attendance');
};
</script>

<style scoped>
.input {
  margin-top: 4px;
}
</style>
