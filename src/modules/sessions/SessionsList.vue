<template>
  <div class="p-4">
    <!-- Mostrar la lista solo si no estamos en una ruta hija -->
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Sesiones</h1>
      
      <div class="flex justify-end mb-4">
        <router-link to="/sessions/create" class="btn btn-primary">Crear Nueva Sesión</router-link>
      </div>

      <!-- Si no hay sesiones, muestra un mensaje -->
      <div v-if="sessions.length === 0">
        <p>No hay sesiones disponibles.</p>
      </div>

      <!-- Si hay sesiones, muestra la tabla -->
      <table v-else class="table w-full">
        <thead>
          <tr>
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
          <tr v-for="session in sessions" :key="session.idSesion">
            <td>{{ session.lugar }}</td>
            <td>{{ session.fecha }}</td>
            <td>{{ session.horaInicio }}</td>
            <td>{{ session.horaFinal }}</td>
            <td>{{ session.presidente }}</td>
            <td>{{ session.secretario }}</td>
            <td class="flex gap-2">
              <router-link :to="`/sessions/${session.idSesion}`" class="btn btn-info btn-sm">Ver</router-link>
              <router-link :to="`/sessions/edit/${session.idSesion}`" class="btn btn-warning btn-sm">Editar</router-link>
              <button @click="showConfirmModal(session.idSesion ?? 0)" class="btn btn-error btn-sm">Eliminar</button>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { getSessions, deleteSession, Session } from '../../services/SessionServices';

// Estado de las sesiones
const sessions = ref<Session[]>([]);

// Estado para manejar la visibilidad del modal
const isModalVisible = ref(false);
const sessionIdToDelete = ref<number | null>(null);

// Detectar si una ruta hija está activa
const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/sessions/create') || r.path.includes('/sessions/edit') || r.path.includes('/sessions/'));
});

// Función para cargar las sesiones desde la API
const loadSessions = async () => {
  try {
    const response = await getSessions();
    sessions.value = response;
  } catch (error) {
    console.error('Error al cargar las sesiones:', error);
  }
};

// Mostrar modal para confirmar eliminación
const showConfirmModal = (id: number) => {
  sessionIdToDelete.value = id;
  isModalVisible.value = true;
};

// Función para confirmar la eliminación de una sesión
const confirmDelete = async () => {
  if (sessionIdToDelete.value !== null) {
    try {
      await deleteSession(sessionIdToDelete.value);
      sessions.value = sessions.value.filter(session => session.idSesion !== sessionIdToDelete.value);
      isModalVisible.value = false;
      sessionIdToDelete.value = null;
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
    }
  }
};

const cancelDelete = () => {
  isModalVisible.value = false;
  sessionIdToDelete.value = null;
};

// Cargar las sesiones cuando el componente se monte
onMounted(loadSessions);
watch(route, loadSessions);
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
