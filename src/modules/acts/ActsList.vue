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
              <th class="text-left p-3">ID de Sesión</th>
              <th class="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acta in actas" :key="acta.idActa" class="hover:bg-primary-focus transition-all">
              <td class="p-3">
                <div class="tooltip tooltip-right" data-tip="Número único del acta">
                  <span class="badge badge-secondary">{{ acta.idActa }}</span>
                </div>
              </td>
              <td class="p-3">
                <span
                  :class="{
                    'badge badge-success': acta.estado === 'Aprobada',
                    'badge badge-warning': acta.estado === 'Pendiente',
                    'badge badge-error': acta.estado === 'Rechazada',
                  }"
                  >{{ acta.estado }}</span
                >
              </td>
              <td class="p-3">{{ acta.sesionId || "No asignado" }}</td>
              <td class="p-3">
                <div class="flex gap-2">
                  <router-link :to="`/acts/${acta.idActa}`" class="btn btn-info btn-sm" data-tip="Ver Detalles">
                    <EyeIcon class="w-5 h-5" />
                  </router-link>
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
import { Acta, getActas } from '../../services/actaService';

// Importar los iconos de Heroicons
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon }  from '@heroicons/vue/24/solid';

const actas = ref<Acta[]>([]);
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

onMounted(() => {
  loadActas();
});

const showConfirmModal = (id: number) => {
  actaIdToDelete.value = id;
  isModalVisible.value = true;
};

const confirmDelete = () => {
  if (actaIdToDelete.value !== null) {
    const index = actas.value.findIndex((acta: Acta) => acta.idActa === actaIdToDelete.value);
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

<style scoped>
.p-4 {
  padding: 16px;
}
.table th, .table td {
  padding: 12px;
}
.tooltip {
  display: inline-block;
  position: relative;
}
</style>
