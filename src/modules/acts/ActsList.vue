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
            <tr v-for="acta in actas" :key="acta.idActa" class="hover:bg-primary-focus transition-all">
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
                  <router-link :to="`/acts/edit/${acta.idActa}`" class="btn btn-warning btn-sm" data-tip="Editar Acta">
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
import { PlusIcon, EyeIcon, CheckIcon, FunnelIcon} from '@heroicons/vue/24/solid';
import { ActaDetail } from '../../Utils/Interfaces/MeetingRecords';

const actas = ref<ActaDetail[]>([]);
const isModalVisible = ref(false);
const actaIdToDelete = ref<number | null>(null);

const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/acts/create') || r.path.includes('/acts/edit') || r.path.includes('/acts/'));
});

const loadActas = async () => {
  try {
    const response = await getActas();
    actas.value = response.data || [];
    console.log('Actas cargadas:', actas.value);
  } catch (error) {
    console.error('Error al cargar actas:', error);
  }
};

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

