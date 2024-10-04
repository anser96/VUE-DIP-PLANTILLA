<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Miembros</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/members/create" class="btn btn-primary">Crear Nuevo Miembro</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.idMember">
              <td>{{ member.idMember }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.role }}</td>
              <td class="flex gap-2">
                <router-link :to="`/members/${member.idMember}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/members/edit/${member.idMember}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(member.idMember)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar miembro) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de miembros almacenados localmente (simulación)
  const members = ref([
    { idMember: 1, name: 'Juan Pérez', role: 'Presidente' },
    { idMember: 2, name: 'María López', role: 'Secretario' }
  ]);
  
  const isModalVisible = ref(false);
  const memberIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/members/create') || r.path.includes('/members/edit') || r.path.includes('/members/'));
  });
  
  const showConfirmModal = (id: number) => {
    memberIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (memberIdToDelete.value !== null) {
      const index = members.value.findIndex(member => member.idMember === memberIdToDelete.value);
      if (index !== -1) {
        members.value.splice(index, 1); // Eliminar miembro de la lista
      }
    }
    isModalVisible.value = false;
    memberIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    memberIdToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  