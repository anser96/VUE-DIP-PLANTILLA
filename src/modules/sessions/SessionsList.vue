<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Sesiones</h1>
        
        <div class="flex justify-end mb-4">
          <router-link to="/sessions/create" class="btn btn-primary">Crear Nueva Sesión</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Hora de Inicio</th>
              <th>Hora de Fin</th>
              <th>Presidente</th>
              <th>Secretario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in sessions" :key="session.idSession">
              <td>{{ session.idSession }}</td>
              <td>{{ session.location }}</td>
              <td>{{ session.date }}</td>
              <td>{{ session.startTime }}</td>
              <td>{{ session.endTime }}</td>
              <td>{{ session.president }}</td>
              <td>{{ session.secretary }}</td>
              <td class="flex gap-2">
                <router-link :to="`/sessions/${session.idSession}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/sessions/edit/${session.idSession}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(session.idSession)" class="btn btn-error btn-sm">Eliminar</button>
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
      
      <!-- Añadir router-view para cargar las rutas hijas (como crear o editar sesión) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de sesiones almacenadas localmente
  const sessions = ref([
    { idSession: 1, location: 'Sala de Conferencias', date: '2024-09-28', startTime: '08:00:00', endTime: '12:00:00', president: 'John Doe', secretary: 'Jane Smith' },
    { idSession: 2, location: 'Auditorio Principal', date: '2024-10-03', startTime: '09:00:00', endTime: '13:00:00', president: 'Alice Johnson', secretary: 'Bob Brown' }
  ]);
  
  const isModalVisible = ref(false);
  const sessionIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/sessions/create') || r.path.includes('/sessions/edit')|| r.path.includes('/sessions/'));
  });
  
  const showConfirmModal = (id: number) => {
    sessionIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (sessionIdToDelete.value !== null) {
      const index = sessions.value.findIndex(session => session.idSession === sessionIdToDelete.value);
      if (index !== -1) {
        sessions.value.splice(index, 1); // Eliminar sesión de la lista
      }
    }
    isModalVisible.value = false;
    sessionIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    sessionIdToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  