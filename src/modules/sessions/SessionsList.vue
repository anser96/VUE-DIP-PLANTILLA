<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Sesiones</h1>

      <!-- Componente de Filtro Genérico -->
      <GenericFilter
        :filters="filterDefinitions"
        :isModalVisible="isFilterModalVisible"
        @filter="applyFilter"
        @close="isFilterModalVisible = false"
      />

      <div class="join flex justify-end">
        <!-- Botón para abrir la modal de filtros -->
        <button @click="isFilterModalVisible = true" class="btn join-item btn-primary mb-4">
          <FunnelIcon class="w-5 h-5" /> Filtros
        </button>
        <!-- Botón para limpiar los filtros -->
        <button @click="clearFilters" class="btn join-item btn-primary mb-4">
          Limpiar Filtros
        </button>

        <div class="mb-4">
          <router-link to="/sessions/create" class="btn join-item btn-primary">
            <PlusIcon class="w-5 h-5" /> Nueva Sesión
          </router-link>
        </div>
      </div>

      <!-- Mensaje si no hay sesiones disponibles -->
      <div v-if="filteredSessions.length === 0">
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
          <tr v-for="session in filteredSessions" :key="session.idSesion">
            <td>{{ session.lugar }}</td>
            <td>{{ session.fecha }}</td>
            <td>{{ formatTime(`${session.horaInicio}`) }}</td>
            <td>{{ formatTime(`${session.horaFinal}`) }}</td>
            <td>{{ session.presidente }}</td>
            <td>{{ session.secretario }}</td>
            <td class="flex gap-2">
              <router-link :to="`/sessions/${session.idSesion}`" class="btn btn-info btn-sm">Ver</router-link>
              <router-link v-if="isActaPendiente(session)" :to="`/sessions/edit/${session.idSesion}`" class="btn btn-warning btn-sm">Editar</router-link>
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
import GenericFilter from '../../components/GenericFilter.vue'; // Importa el filtro genérico
import { FunnelIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { deleteSesion, getSesiones } from '../../services/sesionServices';
import { ApiResponse, Sesion } from '../../Utils/Interfaces/MeetingRecords';

const isFilterModalVisible = ref(false);
const sessions = ref<Sesion[]>([]);
const filteredSessions = ref<Sesion[]>([]);
  const filters = ref({
  lugar: '',
  fecha: '',
  presidente: '',
  secretario: '',
  horaInicio: '',
  horaFinal: '',
  contenido: '',
  asistenciaMiembros: '',
  asistenciaInvitados: '',
  tareas: '',
  solicitudes: '',
  actaDTO: ''
});

const clearFilters = () => {
  filters.value = {
    lugar: '',
    fecha: '',
    presidente: '',
    secretario: '',
    horaInicio: '',
    horaFinal: '',
    contenido: '',
    asistenciaMiembros: '',
    asistenciaInvitados: '',
    tareas: '',
    solicitudes: '',
    actaDTO: ''
  };
  filteredSessions.value = [...sessions.value]; // Restablecer a todas las sesiones cargadas inicialmente
};

// Definiciones de filtros
interface Filter {
  key: string;
  label: string;
  type: "text" | "date" | "select";
  placeholder?: string;
}

const filterDefinitions: Filter[] = [
  { key: 'lugar', label: 'Ubicación', type: 'text', placeholder: 'Buscar por ubicación' },
  { key: 'fecha', label: 'Fecha', type: 'date' },
  { key: 'presidente', label: 'Presidente', type: 'text', placeholder: 'Buscar por presidente' },
  { key: 'secretario', label: 'Secretario', type: 'text', placeholder: 'Buscar por secretario' },
  { key: 'contenido', label: 'Contenido', type: 'text', placeholder: 'Buscar en contenido' }
];


const isModalVisible = ref(false);
const sessionIdToDelete = ref<number | null>(null);

const route = useRoute();
const isChildRouteActive = computed(() =>
  route.matched.some(r => r.path.includes('/sessions/create') || r.path.includes('/sessions/edit') || r.path.includes('/sessions/'))
);

const loadSessions = async () => {
  try {
    const response: ApiResponse<Sesion[]> = await getSesiones();
    sessions.value = response.data ?? [];
    filteredSessions.value = [...sessions.value]; // Inicialmente todas las sesiones
  } catch (error) {
    console.error('Error al cargar las sesiones:', error);
  }
};

// Función para aplicar filtros sobre todos los campos, incluyendo anidados
const applyFilter = (filterValues: Record<string, string>) => {
  filteredSessions.value = sessions.value.filter(session => {
    return Object.entries(filterValues).every(([_, value]) => {
      if (!value) return true; // Ignora filtros vacíos
      return searchInObject(session, value); // Llama a la función recursiva para buscar en cualquier campo
    });
  });
};

// Función recursiva para buscar el valor dentro de cualquier campo del objeto (incluyendo anidados)
const searchInObject = (obj: any, searchTerm: string): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase();

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    // Si el campo es un objeto o un array, aplica la búsqueda de forma recursiva
    if (typeof value === 'object' && value !== null) {
      if (searchInObject(value, lowerSearchTerm)) {
        return true; // Encuentra el término de búsqueda en un campo anidado
      }
    } else if (String(value).toLowerCase().includes(lowerSearchTerm)) {
      // Convierte el valor en string y busca el término en el campo actual
      return true;
    }
  }
  return false;
};

// Mostrar modal de confirmación para eliminar sesión
const showConfirmModal = (id: number) => {
  sessionIdToDelete.value = id;
  isModalVisible.value = true;
};

const isActaPendiente = (sesion) => {
  return sesion?.actaDTO?.[0]?.estado === 'PENDIENTE';
};

// Confirmar y eliminar sesión
const confirmDelete = async () => {
  if (sessionIdToDelete.value !== null) {
    try {
      await deleteSesion(sessionIdToDelete.value);
      sessions.value = sessions.value.filter(session => session.idSesion !== sessionIdToDelete.value);
      filteredSessions.value = sessions.value; // Actualizar sesiones filtradas
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

onMounted(loadSessions);
watch(route, loadSessions);
</script>
