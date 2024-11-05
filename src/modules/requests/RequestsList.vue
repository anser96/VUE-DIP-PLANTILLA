<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Solicitudes</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/requests/create" class="btn btn-primary">Crear Nueva Solicitud</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dependencia</th>
              <th>Asunto</th>
              <th>Descripcion</th>
              <th>Fecha de Solicitud</th>
              <th>Respuesta</th>
              <th>Estado</th>
              <th>TipoSolicitante</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="solicitud in solicitudes" :key="solicitud.idSolicitud">
              <td>{{ solicitud.idSolicitud }}</td>
              <td>{{ solicitud.dependencia }}</td>
              <td>{{ solicitud.asunto }}</td>
              <td>{{ solicitud.descripcion }}</td>
              <td>{{ formatDate(solicitud.fechaDeSolicitud) }}</td>
              <td>{{ solicitud.respuesta}}</td>
              <td>{{ solicitud.estado }}</td>
              <td>{{ solicitud.tipoSolicitante }}</td>
              <td class="flex gap-2">
                <router-link :to="`/requests/edit/${solicitud.idSolicitud}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/requests/edit/${solicitud.idSolicitud}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(solicitud.idSolicitud)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Añadir router-view para cargar las rutas hijas (como crear o editar solicitud) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted} from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  import { getSolicitudes, deleteSolicitud } from '../../services/solicitudServices';
  import type { Solicitud } from '../../Utils/Interfaces/MeetingRecords';
  
  // Lista de solicitudes almacenadas localmente
  const solicitudes = ref<Solicitud[]>([]);
  
  const isModalVisible = ref(false);
  const solicitudIdToDelete = ref<number | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/requests/create') || r.path.includes('/requests/edit') || r.path.includes('/requests/'));
});

onMounted(async () => {
  try {
    const response = await getSolicitudes();
    console.log('la data ',response);
    
    solicitudes.value = response; // Asignar directamente la respuesta
    console.log('Estas son las solicitudes:', solicitudes.value);
  } catch (error) {
    console.error('Error al cargar las solicitudes:', error);
  }
});
   
  
  const showConfirmModal = (id: number) => {
    solicitudIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  const confirmDelete = async () => {
  if (solicitudIdToDelete.value !== null) {
    try {
      await deleteSolicitud(solicitudIdToDelete.value);
      solicitudes.value = solicitudes.value.filter(
        (solicitud) => solicitud.idSolicitud !== solicitudIdToDelete.value
      ); // Eliminar localmente
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
    } finally {
      isModalVisible.value = false;
      solicitudIdToDelete.value = null;
    }
  }
};
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    solicitudIdToDelete.value = null;
  };
  
  // Formato de fecha
  const formatDate = (date: string) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    return new Date(date).toLocaleDateString('es-ES', options);
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  