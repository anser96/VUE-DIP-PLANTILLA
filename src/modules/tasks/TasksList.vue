<template>
    <div class="p-4">
      <!-- Mostrar la lista solo si no estamos en una ruta hija -->
      <div v-if="!isChildRouteActive">
        <h1 class="text-3xl font-bold mb-4">Lista de Tareas</h1>

        <div class="flex justify-end mb-4">
          <router-link to="/tasks/create" class="btn btn-primary">Crear Tarea</router-link>
        </div>

        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Session ID</th>
              <th>Delivery Date</th>
              <th>Verification Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.idTask">
              <td>{{ task.idTask }}</td>
              <td>{{ task.description }}</td>
              <td>{{ task.sessionId }}</td>
              <td>{{ formatDate(task.deliveryDate) }}</td>
              <td>{{ formatDate(task.verificationDate) }}</td>
              <td class="flex gap-2">
                <router-link :to="`/tasks/${task.idTask}`" class="btn btn-info btn-sm">View</router-link>
                <router-link :to="`/tasks/edit/${task.idTask}`" class="btn btn-warning btn-sm">Edit</router-link>
                <button @click="showConfirmModal(task.idTask)" class="btn btn-error btn-sm">Delete</button>
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

      <!-- Añadir router-view para cargar las rutas hijas (como crear o editar tarea) -->
      <router-view v-else />
    </div>
  </template>

  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';

  // Lista de tareas almacenadas localmente
  const tasks = ref([
    { idTask: 1, description: 'Task 1', sessionId: 1, deliveryDate: '2024-10-10', verificationDate: '2024-10-12' },
    { idTask: 2, description: 'Task 2', sessionId: 2, deliveryDate: '2024-10-11', verificationDate: '2024-10-13' }
  ]);

  const isModalVisible = ref(false);
  const taskIdToDelete = ref<number | null>(null);

  // Detectar si una ruta hija está activa
  const route = useRoute();
  const isChildRouteActive = computed(() => {
    return route.matched.some(r => r.path.includes('/tasks/create') || r.path.includes('/tasks/edit') || r.path.includes('/tasks/'));
  });

  const showConfirmModal = (id: number) => {
    taskIdToDelete.value = id;
    isModalVisible.value = true;
  };

  const confirmDelete = () => {
    if (taskIdToDelete.value !== null) {
      const index = tasks.value.findIndex(task => task.idTask === taskIdToDelete.value);
      if (index !== -1) {
        tasks.value.splice(index, 1); // Eliminar tarea de la lista
      }
    }
    isModalVisible.value = false;
    taskIdToDelete.value = null;
  };

  const cancelDelete = () => {
    isModalVisible.value = false;
    taskIdToDelete.value = null;
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
