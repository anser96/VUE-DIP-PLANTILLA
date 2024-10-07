<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Asistencia de Miembros</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/attendance-members/create" class="btn btn-primary">Registrar Nueva Asistencia</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID Sesión</th>
              <th>ID Miembro</th>
              <th>Estado de Asistencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attendance in attendances" :key="`${attendance.SESION_IDSESION}-${attendance.MIEMBROS_IDMIEMBRO}`">
              <td>{{ attendance.SESION_IDSESION }}</td>
              <td>{{ attendance.MIEMBROS_IDMIEMBRO }}</td>
              <td>{{ attendance.ESTADO_ASISTENCIA }}</td>
              <td class="flex gap-2">
                <router-link :to="`/attendance-members/${attendance.SESION_IDSESION}/${attendance.MIEMBROS_IDMIEMBRO}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/attendance-members/edit/${attendance.SESION_IDSESION}/${attendance.MIEMBROS_IDMIEMBRO}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(attendance.SESION_IDSESION, attendance.MIEMBROS_IDMIEMBRO)" class="btn btn-error btn-sm">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Confirmación de eliminación -->
        <ConfirmModal 
          :show="isModalVisible"  
          @confirm="confirmDelete" 
          @cancel="cancelDelete" 
        />
      </div>
  
      <!-- Cargar rutas hijas (como crear o editar asistencia) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de asistencias simuladas
  const attendances = ref([
    { SESION_IDSESION: 1, MIEMBROS_IDMIEMBRO: 101, ESTADO_ASISTENCIA: 'ASISTIO' },
    { SESION_IDSESION: 2, MIEMBROS_IDMIEMBRO: 102, ESTADO_ASISTENCIA: 'NO ASISTIO' }
  ]);
  
  const isModalVisible = ref(false);
  const attendanceToDelete = ref<{ SESION_IDSESION: number; MIEMBROS_IDMIEMBRO: number } | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/attendance-members/create') || r.path.includes('/attendance-members/edit') || r.path.includes('/attendance-members/'));
  });
  
  const showConfirmModal = (sesId: number, memberId: number) => {
    attendanceToDelete.value = { SESION_IDSESION: sesId, MIEMBROS_IDMIEMBRO: memberId };
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (attendanceToDelete.value) {
      const index = attendances.value.findIndex(
        a => a.SESION_IDSESION === attendanceToDelete.value!.SESION_IDSESION && a.MIEMBROS_IDMIEMBRO === attendanceToDelete.value!.MIEMBROS_IDMIEMBRO
      );
      if (index !== -1) {
        attendances.value.splice(index, 1); // Eliminar asistencia de la lista
      }
    }
    isModalVisible.value = false;
    attendanceToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    attendanceToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  