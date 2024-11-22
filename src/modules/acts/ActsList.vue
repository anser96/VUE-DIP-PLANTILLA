<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-4xl font-bold text-primary mb-6">Lista de Actas</h1>

      <div class="flex justify-between items-center mb-6">
        <p class="text-lg text-gray-600">Explora y gestiona todas las actas registradas.</p>
        <router-link to="/sessions/create" class="btn btn-primary shadow-lg flex items-center gap-2">
          <PlusIcon class="w-5 h-5" /> Crear Acta y Sesión
        </router-link>
      </div>
<!-- Componente de Filtro Genérico -->
<FilterActas :filters="filterDefinitions" :isModalVisible="isFilterModalVisible" @filter="applyFilter"
        @close="isFilterModalVisible = false" />

      <div class="join flex justify-end">
        <!-- Botón para abrir el modal de filtros -->
        <button @click="isFilterModalVisible = true" class="btn join-item btn-primary mb-4">
          <FunnelIcon class="w-5 h-5" /> Filtros
        </button>
        <!-- Botón para limpiar los filtros -->
        <button @click="clearFilters" class="btn join-item btn-primary mb-4">Limpiar Filtros</button>
      </div>
      

      <div class="overflow-x-auto">
        <table class="table table-zebra w-full rounded-lg shadow-md">
          <thead class="bg-primary text-primary-content">
            <tr>
              <th class="text-left p-3">Número de Acta</th>
              <th class="text-left p-3">Estado</th>
              <th class="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acta in filteredActs" :key="acta.idActa" class="hover:bg-primary-focus transition-all">
              <td class="p-3">
                <div class="tooltip tooltip-right" data-tip="Número único del acta">
                  <span class="badge badge-secondary">{{ acta.numeroActa }}</span>
                </div>
              </td>
              <td class="p-3">
                <span
                  :class="{
                    'badge badge-success': acta.estado === 'APROBADA',
                    'badge badge-warning': acta.estado === 'PENDIENTE',
                    'badge badge-error': acta.estado === 'RECHAZADA',
                  }"
                  >{{ acta.estado }}</span
                >
              </td>
              <td class="p-3">
                <div class="flex gap-2">
                  <router-link :to="`/acts/${acta.idActa}`" class="btn btn-info btn-sm" data-tip="Ver Detalles">
                    <EyeIcon class="w-5 h-5" />
                  </router-link>
                  <button v-if="acta.estado !== 'APROBADA'" @click="aprobarActa(acta.idActa)" class="btn btn-success btn-sm">
                    <CheckIcon class="w-5 h-5" />
                  </button>
                  <!-- Comentado hasta implementar -->
                  <!--
                  <router-link :to="/acts/edit/${acta.idActa}" class="btn btn-warning btn-sm" data-tip="Editar Acta">
                    <PencilIcon class="w-5 h-5" />
                  </router-link>
                  <button @click="showConfirmModal(acta.idActa)" class="btn btn-error btn-sm" data-tip="Eliminar Acta">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                  -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mensaje si no hay actas disponibles -->
      <div v-if="filteredActs.length === 0">
        <p>No hay Actas disponibles.</p>
      </div>
      <ConfirmModal 
        :show="isModalVisible"  
        @confirm="confirmDelete" 
        @cancel="cancelDelete" 
      />
  </div>
  <router-view v-else />
</div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { getActas, aprobarActaService } from '../../services/actaService.ts';
import { EyeIcon, CheckIcon } from '@heroicons/vue/24/solid';
import { FunnelIcon } from '@heroicons/vue/24/outline';
import { Acta, ActaDetail } from '../../Utils/Interfaces/MeetingRecords';
import FilterActas from '../../components/FilterActas.vue';

const actas = ref<ActaDetail[]>([]);
const isModalVisible = ref(false);
const isFilterModalVisible = ref(false)
const actaIdToDelete = ref<number | null>(null);
const filteredActs = ref<Acta[]>([])
const filters = ref({
  fecha: '',
  estado: '',
})

const clearFilters = () => {
  filters.value = {
  fecha: '',
  estado: '',
}
  filteredActs.value = [...actas.value] // Restablecer a todas las sesiones cargadas inicialmente
}

// Definiciones de filtros
interface Filter {
  key: string
  label: string
  type: 'date' | 'text'
  placeholder?: string
}

const filterDefinitions: Filter[] = [
  { key: 'fecha', label: 'Fecha', type: 'date' },
  { key: 'estado', label: 'Estado', type: 'text', placeholder: 'Buscar por estado' },
]

const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/acts/create') || r.path.includes('/acts/edit') || r.path.includes('/acts/'));
});

const loadActas = async () => {
  try {
    const response = await getActas();
    actas.value = response.data || [];
    filteredActs.value = [...actas.value];  // Inicia filteredActs con las actas cargadas
    console.log('Actas cargadas:', actas.value);
  } catch (error) {
    console.error('Error al cargar actas:', error);
  }
}

// Función para aplicar filtros sobre todos los campos, incluyendo anidados
const applyFilter = (filterValues: Record<string, string>) => {
  filteredActs.value = actas.value.filter((acta) => {
    return Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true; // Ignora filtros vacíos

      // Compara valores según el tipo de campo (si es fecha, conviértelo a fecha real)
      if (key === 'fecha') {
        return filterByDate(acta.sesion.fecha, value); // Accede a la fecha dentro de sesion
      } else {
        return searchInObject(acta, value, key); // Usa búsqueda recursiva para otros campos
      }
    });
  });
};

// Función para comparar la fecha
const filterByDate = (dateValue: string, filterValue: string) => {
  const actaDate = new Date(dateValue);
  const filterDate = new Date(filterValue);
  return actaDate.toDateString() === filterDate.toDateString(); // Compara solo la fecha
};

// Función recursiva para buscar en el objeto
const searchInObject = (obj: any, searchTerm: string, key: string): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase();

  const value = obj[key];
  if (typeof value === 'object' && value !== null) {
    return searchInObject(value, lowerSearchTerm, key); // Aplicar búsqueda recursiva
  } else if (String(value).toLowerCase().includes(lowerSearchTerm)) {
    return true; // Si encuentra el término de búsqueda en el campo
  }
  return false;
}

// Lógica para aprobar acta
const aprobarActa = async (actaId) => {
  try {
    const response = await aprobarActaService(actaId);

    if (response.status === "success") {
      const actaIndex = actas.value.findIndex((acta) => acta.idActa === actaId);
      if (actaIndex !== -1) {
        actas.value[actaIndex].estado = "APROBADA";
      }
    }
  } catch (error) {
    // Verificar si es un error de respuesta del backend y capturar mensaje
    if (error.response) {
      const errorMessage = error.response.data?.message || "Ocurrió un error al intentar aprobar el acta.";
      console.error("Error específico del backend:", errorMessage);
      alert(errorMessage);
    } else {
      console.error("Error al aprobar el acta:", error.message);
      alert("Ocurrió un error al intentar aprobar el acta.");
    }
  }
};


onMounted(() => {
  loadActas();
});

const showConfirmModal = (id: number) => {
  actaIdToDelete.value = id;
  isModalVisible.value = true;
};

const confirmDelete = () => {
  if (actaIdToDelete.value !== null) {
    const index = actas.value.findIndex((acta: ActaDetail) => acta.idActa === actaIdToDelete.value);
    if (index !== -1) {
      actas.value.splice(index, 1);
    }
  }
  isModalVisible.value = false;
  actaIdToDelete.value = null;
};

const cancelDelete = () => {
  isModalVisible.value = false;
  actaIdToDelete.value = null;
};
</script>