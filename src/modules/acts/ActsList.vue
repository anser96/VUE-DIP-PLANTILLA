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
          <tr v-for="acta in actas" :key="acta.numeroActa">
            <td>{{ acta.numeroActa }}</td>
            <td>{{ acta.estado }}</td>
            <td></td>
            <td class="flex gap-2">
              <router-link :to="`/acts/${acta.numeroActa}`" class="btn btn-info btn-sm">Ver</router-link>
              <router-link :to="`/acts/edit/${acta.numeroActa}`" class="btn btn-warning btn-sm">Editar</router-link>
              <button @click="showConfirmModal(acta.numeroActa)" class="btn btn-error btn-sm">Eliminar</button>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { Acta, getActas } from '../../services/actaService';


const actas = ref<Acta[]>([]);
const isModalVisible = ref(false);
const actaIdToDelete = ref<number | null>(null);

// Detectar si una ruta hija está activa
const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/acts/create') || r.path.includes('/acts/edit') || r.path.includes('/acts/'));
});

// Cargar las actas desde el servicio
const loadActas = async () => {
  try {
    const response = await getActas();
    actas.value = response.data || [];
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
    const index = actas.value.findIndex((acta: Acta) => acta.numeroActa === actaIdToDelete.value);
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