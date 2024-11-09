<template>
    <div class="p-4">
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Tareas</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/tasks/create" class="btn btn-primary">Crear Tarea</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Fecha de Entrega</th>
              <th>Fecha de Verificación</th>
              <th>Tipo de Responsable</th>
              <th>ID del Responsable</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.idTarea">
              <td>{{ task.idTarea }}</td>
              <td>{{ task.descripcion }}</td>
              <td>{{ formatDate(task.fechaEntrega) }}</td>
              <td>{{ formatDate(task.fechaVerificacion) }}</td>
              <td>{{ task.tipoResponsable }}</td>
              <td>{{ task.responsableId }}</td>
              <td>{{ task.estado }}</td>
              <td class="flex gap-2">
                <button @click="viewTask(task)" class="btn btn-info btn-sm">Ver</button>
                <button @click="openEditModal(task)" class="btn btn-warning btn-sm">Editar</button>
                <button @click="showConfirmModal(task.idTarea)" class="btn btn-error btn-sm">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Modal Confirmación Eliminar -->
        <ConfirmModal :show="isModalVisible" @confirm="confirmDelete" @cancel="cancelDelete" />
      </div>
  
      <router-view v-else />
  
      <!-- Modal de Edición de Tarea -->
      <div v-if="isEditModalVisible" class="modal-background">
        <div class="modal-content">
          <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>
          <label>IdTarea:</label>
          <input v-model="selectedTask.idTarea" class="input" disabled />
          <label>Descripción:</label>
          <input v-model="selectedTask.descripcion" class="input" />
          <label>Fecha de Entrega:</label>
          <input v-model="selectedTask.fechaEntrega" class="input" type="date" />
          <label>Fecha de Verificación:</label>
          <input v-model="selectedTask.fechaVerificacion" class="input" type="date" />
          <label>Tipo Responsable:</label>
          <input v-model="selectedTask.tipoResponsable" class="input" />
          <label>ResponsableId:</label>
          <input v-model="selectedTask.responsableId" class="input" />
          <label>Estado:</label>
          <input v-model="selectedTask.estado" class="input" />
  
          <div class="flex justify-between gap-2 mt-4">
            <button @click="closeEditModal" class="btn btn-secondary">Cerrar</button>
            <button @click="saveTask" class="btn btn-success">Guardar Cambios</button>
          </div>
        </div>
      </div>
  
      <!-- Modal de Ver Tarea -->
      <div v-if="isViewModalVisible" class="modal-background">
        <div class="modal-content">
          <h2 class="text-2xl font-bold mb-4">Información de la Tarea</h2>
          <p><strong>IdTarea:</strong> {{ selectedTask.idTarea }}</p>
          <p><strong>Descripción:</strong> {{ selectedTask.descripcion }}</p>
          <p><strong>Fecha de Entrega:</strong> {{ formatDate(selectedTask.fechaEntrega) }}</p>
          <p><strong>Fecha de Verificación:</strong> {{ formatDate(selectedTask.fechaVerificacion) }}</p>
          <p><strong>Tipo Responsable:</strong> {{ selectedTask.tipoResponsable }}</p>
          <p><strong>ResponsableId:</strong> {{ selectedTask.responsableId }}</p>
          <p><strong>Estado:</strong> {{ selectedTask.estado }}</p>
  
          <div class="mt-4">
            <button @click="closeViewModal" class="btn btn-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  import { Tarea, ApiResponse } from "../../Utils/Interfaces/MeetingRecords";
  import { deleteTarea, getTareas } from "../../services/tareaServices";
  
  const tasks = ref<Tarea[]>([]);
  const isModalVisible = ref(false);
  const isEditModalVisible = ref(false);
  const isViewModalVisible = ref(false);
  const taskIdToDelete = ref<number | null>(null);
  const selectedTask = ref<any>(null);
  
  const isChildRouteActive = computed(() =>
    useRoute().matched.some(
      (r) =>
        r.path.includes("/tasks/create") || r.path.includes("/tasks/edit")
    )
  );
  
  onMounted(async () => {
    try {
      const response: ApiResponse<Tarea[]> = await getTareas();
      if (Array.isArray(response)) {
        tasks.value = response;
      } else if ("data" in response && Array.isArray(response.data)) {
        tasks.value = response.data;
      } else if ("results" in response && Array.isArray(response.results)) {
        tasks.value = response.results;
      } else {
        console.error("Estructura inesperada de los datos de tareas:", response);
      }
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    }
  })
  
  const showConfirmModal = (id: number) => {
    taskIdToDelete.value = id;
    isModalVisible.value = true;
  };
  
  // Confirmar y eliminar tarea
  const confirmDelete = () => {
    if (taskIdToDelete.value !== null) {
      const index = tasks.value.findIndex(
        (task) => task.idTarea === taskIdToDelete.value
      );
      if (index !== -1) {
        tasks.value.splice(index, 1);
      }
    }
    isModalVisible.value = false;
    taskIdToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    taskIdToDelete.value = null;
  };
  
  const openEditModal = (task: any) => {
    selectedTask.value = { ...task };
    isEditModalVisible.value = true;
  };
  
  const closeEditModal = () => {
    isEditModalVisible.value = false;
  };
  
  const saveTask = () => {
    const index = tasks.value.findIndex(
      (task) => task.idTarea === selectedTask.value.idTarea
    );
    if (index !== -1) {
      tasks.value[index] = { ...selectedTask.value };
    }
    closeEditModal();
  };
  
  const viewTask = (task: Tarea) => {
    selectedTask.value = task;
    isViewModalVisible.value = true;
  };
  
  const closeViewModal = () => {
    isViewModalVisible.value = false;
  };
  
  // Formato de fecha
  const formatDate = (date: string) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    return new Date(date).toLocaleDateString('es-ES', options);
  };
  </script>
  
  <style scoped>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    max-width: 500px;
    width: 100%;
  }
  
  .input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>