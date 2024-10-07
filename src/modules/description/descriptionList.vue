<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Descripciones</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/descriptions/create" class="btn btn-primary">Crear Nueva Descripción</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiantes Implicados</th>
              <th>Número Estudiantes</th>
              <th>Docentes Implicados</th>
              <th>Número Docentes</th>
              <th>Ciudad Implicada</th>
              <th>País Implicado</th>
              <th>Evento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="description in descriptions" :key="description.ID_DESCRIPCION">
              <td>{{ description.ID_DESCRIPCION }}</td>
              <td>{{ description.ESTU_IMPLICADOS }}</td>
              <td>{{ description.NUM_ESTU_IMPLICADOS }}</td>
              <td>{{ description.DOCEN_IMPLICADOS }}</td>
              <td>{{ description.NUM_DOCEN_IMPLICADOS }}</td>
              <td>{{ description.CUIDAD_IMPLICADA }}</td>
              <td>{{ description.PAIS_IMPLICADO }}</td>
              <td>{{ description.EVENTO }}</td>
              <td class="flex gap-2">
                <router-link :to="`/descriptions/${description.ID_DESCRIPCION}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/descriptions/edit/${description.ID_DESCRIPCION}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(description.ID_DESCRIPCION)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar descripción) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de descripciones simuladas
  const descriptions = ref([
    { ID_DESCRIPCION: 1, ESTU_IMPLICADOS: 'Juan Pérez, Maria Lopez', NUM_ESTU_IMPLICADOS: 2, DOCEN_IMPLICADOS: 'Carlos García', NUM_DOCEN_IMPLICADOS: 1, CUIDAD_IMPLICADA: 'Bogotá', PAIS_IMPLICADO: 'Colombia', EVENTO: 'Congreso Nacional de Ciencias' },
    { ID_DESCRIPCION: 2, ESTU_IMPLICADOS: 'Ana Martinez, José Rodriguez', NUM_ESTU_IMPLICADOS: 2, DOCEN_IMPLICADOS: 'Laura Gómez', NUM_DOCEN_IMPLICADOS: 1, CUIDAD_IMPLICADA: 'Medellín', PAIS_IMPLICADO: 'Colombia', EVENTO: 'Feria de Innovación' }
  ]);
  
  const isModalVisible = ref(false);
  const descriptionIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/descriptions/create') || r.path.includes('/descriptions/edit') || r.path.includes('/descriptions/'));
  });
  
  const showConfirmModal = (id: number) => {
    descriptionIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (descriptionIdToDelete.value !== null) {
      const index = descriptions.value.findIndex(description => description.ID_DESCRIPCION === descriptionIdToDelete.value);
      if (index !== -1) {
        descriptions.value.splice(index, 1); // Eliminar descripción de la lista
      }
    }
    isModalVisible.value = false;
    descriptionIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    descriptionIdToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  