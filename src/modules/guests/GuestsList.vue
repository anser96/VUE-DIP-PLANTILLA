<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Invitados</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/guests/create" class="btn btn-primary">Crear Nuevo Invitado</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dependencia</th>
              <th>Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in guests" :key="guest.idGuest">
              <td>{{ guest.idGuest }}</td>
              <td>{{ guest.name }}</td>
              <td>{{ guest.dependency }}</td>
              <td>{{ guest.role }}</td>
              <td class="flex gap-2">
                <router-link :to="`/guests/${guest.idGuest}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/guests/edit/${guest.idGuest}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(guest.idGuest)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar invitado) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de invitados almacenados localmente (simulación)
  const guests = ref([
    { idGuest: 1, name: 'Carlos Martínez', dependency: 'Departamento de Física', role: 'Investigador' },
    { idGuest: 2, name: 'Ana Gómez G', dependency: 'Departamento de Biología', role: 'Jefe de Proyecto' }
  ]);
  
  const isModalVisible = ref(false);
  const guestIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/guests/create') || r.path.includes('/guests/edit') || r.path.includes('/guests/'));
  });
  
  const showConfirmModal = (id: number) => {
    guestIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (guestIdToDelete.value !== null) {
      const index = guests.value.findIndex(guest => guest.idGuest === guestIdToDelete.value);
      if (index !== -1) {
        guests.value.splice(index, 1); // Eliminar invitado de la lista
      }
    }
    isModalVisible.value = false;
    guestIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    guestIdToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  