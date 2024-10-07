<template>
  <div class="p-4">
    <!-- Mostrar la lista solo si no estamos en una ruta hija -->
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Actas</h1>

      <div class="flex justify-end mb-4">
        <router-link to="/acts/create" class="btn btn-primary">Crear Nueva Acta</router-link>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>Número de Acta</th>
            <th>Estado</th>
            <th>ID de Sesión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acta in actas" :key="acta.NUM_ACTAS">
            <td>{{ acta.NUM_ACTAS }}</td>
            <td>{{ acta.ESTADO }}</td>
            <td>{{ acta.SESION_IDSESION }}</td>
            <td class="flex gap-2">
              <router-link :to="`/acts/${acta.NUM_ACTAS}`" class="btn btn-info btn-sm">Ver</router-link>
              <router-link :to="`/acts/edit/${acta.NUM_ACTAS}`" class="btn btn-warning btn-sm">Editar</router-link>
              <button @click="showConfirmModal(acta.NUM_ACTAS)" class="btn btn-error btn-sm">Eliminar</button>
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

    <!-- Cargar rutas hijas (como crear o editar acta) -->
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../../components/ConfirmModal.vue';

// Lista de actas simuladas
const actas = ref([
  { NUM_ACTAS: 101, ESTADO: 'FIRMADA', SESION_IDSESION: 1 },
  { NUM_ACTAS: 102, ESTADO: 'EN PROCESO', SESION_IDSESION: 2 },
  { NUM_ACTAS: 103, ESTADO: 'FIRMADA', SESION_IDSESION: 3 }
]);

const isModalVisible = ref(false);
const actaIdToDelete = ref<number | null>(null);

// Detectar si una ruta hija está activa
const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/acts/create') || r.path.includes('/acts/edit') || r.path.includes('/acts/'));
});

const showConfirmModal = (id: number) => {
  actaIdToDelete.value = id;
  isModalVisible.value = true;
};

const confirmDelete = () => {
  if (actaIdToDelete.value !== null) {
    const index = actas.value.findIndex(acta => acta.NUM_ACTAS === actaIdToDelete.value);
    if (index !== -1) {
      actas.value.splice(index, 1); // Eliminar acta de la lista
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
.table {
  margin-top: 20px;
}
</style>
