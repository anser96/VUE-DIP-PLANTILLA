<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Sesiones</h1>
      
      <div class="flex justify-end mb-4">
        <router-link to="/sessions/create" class="btn btn-primary">Crear Nueva Sesión</router-link>
      </div>

      <!-- Mensaje si no hay sesiones disponibles -->
      <div v-if="sessions.length === 0">
        <p>No hay sesiones disponibles.</p>
      </div>

      <!-- Tabla de sesiones -->
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
            <td>{{ formatTime(session.horaInicio) }}</td>
            <td>{{ formatTime(session.horaFinal) }}</td>
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
      
      <!-- Modal de confirmación para eliminación -->
      <ConfirmModal :show="isModalVisible" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { getSessions, deleteSession, Session } from '../../services/SessionServices';
import { ApiResponse } from '../../Utils/Interfaces/AuthInterface';

const sessions = ref<Session[]>([]);
const isModalVisible = ref(false);
const sessionIdToDelete = ref<number | null>(null);

const route = useRoute();
const isChildRouteActive = computed(() =>
  route.matched.some(r => r.path.includes('/sessions/create') || r.path.includes('/sessions/edit') || r.path.includes('/sessions/'))
);

// Cargar sesiones desde la API
const loadSessions = async () => {
  try {
    const response: ApiResponse<Session[]> = await getSessions();
    sessions.value = response.data ?? []; // Acceso directo al `data` de la respuesta
  } catch (error) {
    console.error('Error al cargar las sesiones:', error);
  }
};


// Mostrar modal de confirmación para eliminar sesión
const showConfirmModal = (id: number) => {
  sessionIdToDelete.value = id;
  isModalVisible.value = true;
};

// Confirmar y eliminar sesión
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

// Cancelar eliminación
const cancelDelete = () => {
  isModalVisible.value = false;
  sessionIdToDelete.value = null;
};

// Formatear hora de 24h a 12h
const formatTime = (time: string): string => {
  const [hour, minute] = time.split(':');
  const hourNumber = parseInt(hour, 10);
  const period = hourNumber >= 12 ? 'PM' : 'AM';
  const formattedHour = hourNumber % 12 || 12;

  return `${formattedHour}:${minute} ${period}`;
};

// Montar componente y observar cambios de ruta para cargar sesiones
onMounted(loadSessions);
watch(route, loadSessions);
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
