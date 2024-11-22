<template>
  <div class="p-4">
    <!-- Mostrar la lista solo si no estamos en una ruta hija -->
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Solicitudes</h1>

      <div class="flex justify-end mb-4">
        <router-link to="/requests/create" class="btn btn-primary">Crear Nueva Solicitud</router-link>
      </div>

      <!-- Componente de Filtro Genérico -->
      <FilterSoli :filters="filterDefinitions" :isModalVisible="isFilterModalVisible" @filter="applyFilter"
        @close="isFilterModalVisible = false" />

      <div class="join flex justify-end">
        <!-- Botón para abrir la modal de filtros -->
        <button @click="isFilterModalVisible = true" class="btn join-item btn-primary mb-4">
          <FunnelIcon class="w-5 h-5" /> Filtros
        </button>
        <!-- Botón para limpiar los filtros -->
        <button @click="clearFilters" class="btn join-item btn-primary mb-4">Limpiar Filtros</button>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dependencia</th>
            <th>Asunto</th>
            <th>Descripcion</th>
            <th>Fecha de Solicitud</th>
            <th>Respuesta</th>
            <th>Estado</th>
            <th>Solicitante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in filteredSolicitudes" :key="solicitud.idSolicitud">
            <td>{{ solicitud.idSolicitud }}</td>
            <td>{{ solicitud.dependencia }}</td>
            <td>{{ solicitud.asunto }}</td>
            <td>{{ solicitud.descripcion }}</td>
            <td>{{ formatDate(solicitud.fechaDeSolicitud) }}</td>
            <td>{{ solicitud.respuesta }}</td>
            <td>{{ solicitud.estado }}</td>
            <td>{{ solicitud.nombreSolicitante }}</td>
            <td class="flex gap-2">
              <router-link :to="`/requests/${solicitud.idSolicitud}`" class="btn btn-info btn-sm">Ver</router-link>
              <router-link :to="`/requests/editsoli/${solicitud.idSolicitud}`"
                class="btn btn-warning btn-sm">Editar</router-link>
              <button @click="showConfirmModal(solicitud.idSolicitud)" class="btn btn-error btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Confirmación de eliminación -->
      <ConfirmModal :show="isModalVisible" @confirm="confirmDelete" @cancel="cancelDelete" />

      <!-- Mensaje si no hay Solicitudes disponibles -->
      <div v-if="filteredSolicitudes.length === 0">
        <p>No hay Solicitudes disponibles.</p>
      </div>

    </div>
    <router-view v-else />
  </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; const isFilterModalVisible = ref(false)
import ConfirmModal from '../../components/ConfirmModal.vue';
import { getSolicitudes, deleteSolicitud } from '../../services/solicitudServices';
import type { Solicitud } from '../../Utils/Interfaces/MeetingRecords';
import { FunnelIcon } from '@heroicons/vue/24/outline';
import FilterSoli from '../../components/FilterSoli.vue';

// Lista de solicitudes almacenadas localmente
const solicitudes = ref<Solicitud[]>([]);
const isModalVisible = ref(false);
const solicitudIdToDelete = ref<number | null>(null);
const filteredSolicitudes = ref<Solicitud[]>([])
const filters = ref({
  dependencia: '',
  asunto: '',
  estado: '',
  fecha: '',
})

const clearFilters = () => {
  filters.value = {
    dependencia: '',
    asunto: '',
    estado: '',
    fecha: '',
  }
  filteredSolicitudes.value = [...solicitudes.value] // Restablecer a todas las sesiones cargadas inicialmente
}

// Definiciones de filtros
interface Filter {
  key: string
  label: string
  type: 'text' | 'text' | 'text' | 'date'
  placeholder?: string
}

const filterDefinitions: Filter[] = [
  { key: 'dependencia', label: 'Dependencia', type: 'text', placeholder: 'Buscar por dependencia' },
  { key: 'asunto', label: 'Asunto', type: 'text', placeholder: 'Buscar por asunto' },
  { key: 'estado', label: 'Estado', type: 'text', placeholder: 'Buscar por estado' },
  { key: 'fecha', label: 'Fecha', type: 'date' },
]

// Detectar si una ruta hija está activa
const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/requests/create') || r.path.includes('/requests/edit') || r.path.includes('/requests/'));
});

const loadSolicitudes = async () => {
  try {
    const response = await getSolicitudes(); 
    console.log('Respuesta de getSolicitudes:', response);
    solicitudes.value = Array.isArray(response) ? response : response.data || []; // Manejo dinámico
    filteredSolicitudes.value = [...solicitudes.value]; 
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
  }
};



// Función para aplicar filtros sobre todos los campos, incluyendo anidados
const applyFilter = (filterValues: Record<string, string>) => {
  filteredSolicitudes.value = solicitudes.value.filter((solicitud) => {
    return Object.entries(filterValues).every(([_, value]) => {
      if (!value) return true // Ignora filtros vacíos
      return searchInObject(solicitud, value) // Llama a la función recursiva para buscar en cualquier campo
    })
  })
}

// Función recursiva para buscar el valor dentro de cualquier campo del objeto (incluyendo anidados)
const searchInObject = (obj: any, searchTerm: string): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase()

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue

    const value = obj[key]

    // Si el campo es un objeto o un array, aplica la búsqueda de forma recursiva
    if (typeof value === 'object' && value !== null) {
      if (searchInObject(value, lowerSearchTerm)) {
        return true // Encuentra el término de búsqueda en un campo anidado
      }
    } else if (String(value).toLowerCase().includes(lowerSearchTerm)) {
      // Convierte el valor en string y busca el término en el campo actual
      return true
    }
  }
  return false
}

onMounted(() => {
  loadSolicitudes();
});

const showConfirmModal = (id: number) => {
  solicitudIdToDelete.value = id;
  isModalVisible.value = true;
};

const confirmDelete = async () => {
  if (solicitudIdToDelete.value !== null) {
    try {
      await deleteSolicitud(solicitudIdToDelete.value);
      solicitudes.value = solicitudes.value.filter(
        (solicitud) => solicitud.idSolicitud !== solicitudIdToDelete.value
      ); // Eliminar localmente
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
    } finally {
      isModalVisible.value = false;
      solicitudIdToDelete.value = null;
    }
  }
};

const cancelDelete = () => {
  isModalVisible.value = false;
  solicitudIdToDelete.value = null;
};

// Formato de fecha
const formatDate = (date: string) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
  return new Date(date).toLocaleDateString('es-ES', options);
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
