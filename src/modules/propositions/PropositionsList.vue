<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Proposiciones</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/propositions/create" class="btn btn-primary">Crear Nueva Proposición</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Decisión</th>
              <th>Miembro</th>
              <th>Sesión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proposition in propositions" :key="proposition.idProposition">
              <td>{{ proposition.idProposition }}</td>
              <td>{{ proposition.description }}</td>
              <td>{{ proposition.decision }}</td>
              <td>{{ proposition.memberId }}</td>
              <td>{{ proposition.sessionId }}</td>
              <td class="flex gap-2">
                <router-link :to="`/propositions/${proposition.idProposition}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/propositions/edit/${proposition.idProposition}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(proposition.idProposition)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar proposición) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de proposiciones simuladas
  const propositions = ref([
    { idProposition: 1, description: 'Propuesta 1', decision: 'Aprobada', memberId: 1, sessionId: 1 },
    { idProposition: 2, description: 'Propuesta 2', decision: 'Rechazada', memberId: 2, sessionId: 2 }
  ]);
  
  const isModalVisible = ref(false);
  const propositionIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/propositions/create') || r.path.includes('/propositions/edit') || r.path.includes('/propositions/'));
  });
  
  const showConfirmModal = (id: number) => {
    propositionIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (propositionIdToDelete.value !== null) {
      const index = propositions.value.findIndex(proposition => proposition.idProposition === propositionIdToDelete.value);
      if (index !== -1) {
        propositions.value.splice(index, 1); // Eliminar proposición de la lista
      }
    }
    isModalVisible.value = false;
    propositionIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    propositionIdToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  