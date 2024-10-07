<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Orden de Sesión</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/session-order/create" class="btn btn-primary">Crear Nuevo Tema</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Descripción</th>
              <th>ID Sesión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in sessionOrders" :key="order.SESION_IDSESION">
              <td>{{ order.TEMA }}</td>
              <td>{{ order.DESCRIPCION }}</td>
              <td>{{ order.SESION_IDSESION }}</td>
              <td class="flex gap-2">
                <router-link :to="`/session-order/${order.SESION_IDSESION}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/session-order/edit/${order.SESION_IDSESION}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(order.SESION_IDSESION)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar tema) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de órdenes de sesión simuladas
  const sessionOrders = ref([
    { TEMA: 'Presupuesto Anual', DESCRIPCION: 'Discusión sobre el presupuesto anual', SESION_IDSESION: 1 },
    { TEMA: 'Evaluación del Proyecto X', DESCRIPCION: 'Revisión del estado del Proyecto X', SESION_IDSESION: 2 }
  ]);
  
  const isModalVisible = ref(false);
  const orderToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/session-order/create') || r.path.includes('/session-order/edit') || r.path.includes('/session-order/'));
  });
  
  const showConfirmModal = (sesionId: number) => {
    orderToDelete.value = sesionId;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (orderToDelete.value !== null) {
      const index = sessionOrders.value.findIndex(order => order.SESION_IDSESION === orderToDelete.value);
      if (index !== -1) {
        sessionOrders.value.splice(index, 1); // Eliminar orden de la lista
      }
    }
    isModalVisible.value = false;
    orderToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    orderToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  