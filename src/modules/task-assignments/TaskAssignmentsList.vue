<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Encargados de Tareas</h1>
  
        <div class="flex justify-end mb-4">
          <router-link to="/task-assignments/create" class="btn btn-primary">Asignar Nueva Tarea</router-link>
        </div>
  
        <table class="table w-full">
          <thead>
            <tr>
              <th>Estado</th>
              <th>ID Miembro</th>
              <th>ID Tarea</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assignment in taskAssignments" :key="`${assignment.MIEMBROS_IDMIEMBROS}-${assignment.TAREAS_IDTAREAS}`">
              <td>{{ assignment.ESTADO }}</td>
              <td>{{ assignment.MIEMBROS_IDMIEMBROS }}</td>
              <td>{{ assignment.TAREAS_IDTAREAS }}</td>
              <td class="flex gap-2">
                <router-link :to="`/task-assignments/${assignment.MIEMBROS_IDMIEMBROS}/${assignment.TAREAS_IDTAREAS}`" class="btn btn-info btn-sm">Ver</router-link>
                <router-link :to="`/task-assignments/edit/${assignment.MIEMBROS_IDMIEMBROS}/${assignment.TAREAS_IDTAREAS}`" class="btn btn-warning btn-sm">Editar</router-link>
                <button @click="showConfirmModal(assignment.MIEMBROS_IDMIEMBROS, assignment.TAREAS_IDTAREAS)" class="btn btn-error btn-sm">Eliminar</button>
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
  
      <!-- Cargar rutas hijas (como crear o editar asignación) -->
      <router-view v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  
  // Lista de asignaciones de tareas simuladas
  const taskAssignments = ref([
    { ESTADO: 'En Proceso', MIEMBROS_IDMIEMBROS: 101, TAREAS_IDTAREAS: 1 },
    { ESTADO: 'Completada', MIEMBROS_IDMIEMBROS: 102, TAREAS_IDTAREAS: 2 }
  ]);
  
  const isModalVisible = ref(false);
  const assignmentToDelete = ref<{ MIEMBROS_IDMIEMBROS: number; TAREAS_IDTAREAS: number } | null>(null);
  
  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/task-assignments/create') || r.path.includes('/task-assignments/edit') || r.path.includes('/task-assignments/'));
  });
  
  const showConfirmModal = (memberId: number, taskId: number) => {
    assignmentToDelete.value = { MIEMBROS_IDMIEMBROS: memberId, TAREAS_IDTAREAS: taskId };
    isModalVisible.value = true;
  };
  
  const confirmDelete = () => {
    if (assignmentToDelete.value) {
      const index = taskAssignments.value.findIndex(
        a => a.MIEMBROS_IDMIEMBROS === assignmentToDelete.value!.MIEMBROS_IDMIEMBROS && a.TAREAS_IDTAREAS === assignmentToDelete.value!.TAREAS_IDTAREAS
      );
      if (index !== -1) {
        taskAssignments.value.splice(index, 1); // Eliminar asignación de la lista
      }
    }
    isModalVisible.value = false;
    assignmentToDelete.value = null;
  };
  
  const cancelDelete = () => {
    isModalVisible.value = false;
    assignmentToDelete.value = null;
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  </style>
  