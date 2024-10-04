<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Solicitantes</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/applicants/create" class="btn btn-primary">Crear Nuevo Solicitante</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo de Solicitante</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="applicant in applicants" :key="applicant.idApplicant">
              <td>{{ applicant.idApplicant }}</td>
              <td>{{ applicant.name }}</td>
              <td>{{ applicant.type }}</td>
              <td>{{ applicant.email }}</td>
              <td>{{ applicant.phone }}</td>
              <td class="flex gap-2">
                <router-link :to="`/applicants/${applicant.idApplicant}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/applicants/edit/${applicant.idApplicant}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(applicant.idApplicant)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar solicitante) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de solicitantes almacenados localmente (simulación)
  const applicants = ref([
    { idApplicant: 1, name: 'Carlos González', type: 'Estudiante', email: 'carlos@correo.com', phone: '123456789' },
    { idApplicant: 2, name: 'Ana Martínez', type: 'Profesional', email: 'ana@correo.com', phone: '987654321' }
  ]);
  
  const isModalVisible = ref(false);
  const applicantIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/applicants/create') || r.path.includes('/applicants/edit') || r.path.includes('/applicants/'));
  });
  
  const showConfirmModal = (id: number) => {
    applicantIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (applicantIdToDelete.value !== null) {
      const index = applicants.value.findIndex(applicant => applicant.idApplicant === applicantIdToDelete.value);
      if (index !== -1) {
        applicants.value.splice(index, 1); // Eliminar solicitante de la lista
      }
    }
    isModalVisible.value = false;
    applicantIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    applicantIdToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  