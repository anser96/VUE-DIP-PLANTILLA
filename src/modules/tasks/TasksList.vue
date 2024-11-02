<template>
  <div class="p-4">
    <!-- Mostrar la lista solo si no estamos en una ruta hija -->
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Tareas</h1>

      <div class="flex justify-end mb-4">
        <button @click="openModal" class="btn btn-primary">Crear Tarea</button>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Tipo de Responsable</th>
            <th>Fecha de Entrega</th>
            <th>Fecha de Verificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.idTask">
            <td>{{ task.idTask }}</td>
            <td>{{ task.descripcion }}</td>
            <td>{{ task.tipoResponsable }}</td>
            <td>{{ formatDate(task.fechaEntrega) }}</td>
            <td>{{ formatDate(task.fechaVerificacion) }}</td>
            <td class="flex gap-2">
              <router-link :to="`/tasks/${task.idTask}`" class="btn btn-info btn-sm">Ver</router-link>
              <router-link :to="`/tasks/edit/${task.idTask}`" class="btn btn-warning btn-sm">Editar</router-link>
              <button @click="showConfirmModal(task.idTask)" class="btn btn-error btn-sm">Eliminar</button>
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

      <!-- Modal para crear tarea -->
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h1 class="text-3xl font-bold mb-4">Crear Nueva Tarea</h1>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Campo para la Descripción -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                id="description"
                v-model="newTask.descripcion"
                class="input input-bordered w-full"
                placeholder="Ingrese la descripción"
                required
              />
            </div>

            <!-- Campo para el Tipo de Responsable -->
            <div>
              <label for="tipoResponsable" class="block text-sm font-medium text-gray-700">Tipo de Responsable</label>
              <select
                id="tipoResponsable"
                v-model="newTask.tipoResponsable"
                class="input input-bordered w-full"
                required
              >
                <option value="">Seleccione</option>
                <option value="miembro">Miembro</option>
                <option value="invitado">Invitado</option>
              </select>
            </div>

            <!-- Campo para la Fecha de Entrega -->
            <div>
              <label for="dueDate" class="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
              <input
                type="date"
                id="dueDate"
                v-model="newTask.fechaEntrega"
                class="input input-bordered w-full"
                required
              />
            </div>

            <!-- Campo para la Fecha de Verificación -->
            <div>
              <label for="verificationDate" class="block text-sm font-medium text-gray-700">Fecha de Verificación</label>
              <input
                type="date"
                id="verificationDate"
                v-model="newTask.fechaVerificacion"
                class="input input-bordered w-full"
                required
              />
            </div>

            <!-- Botón de Crear -->
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary">Crear Tarea</button>
            </div>
          </form>

          <button @click="closeModal" class="btn btn-secondary mt-4">Cerrar</button>
        </div>
      </div>

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
  { idTask: 1, descripcion: 'Tarea 1', tipoResponsable: 'Miembro', fechaEntrega: '2024-10-10', fechaVerificacion: '2024-10-12' },
  { idTask: 2, descripcion: 'Tarea 2', tipoResponsable: 'Invitado', fechaEntrega: '2024-10-11', fechaVerificacion: '2024-10-13' }
]);

const isModalVisible = ref(false);
const isModalOpen = ref(false);
const taskIdToDelete = ref<number | null>(null);
const newTask = ref({
  idTask: 0,
  descripcion: '',
  tipoResponsable: '',
  fechaEntrega: '',
  fechaVerificacion: ''
});

// Detectar si una ruta hija está activa
const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/tasks/create') || r.path.includes('/tasks/edit'));
});

const openModal = () => {
  isModalOpen.value = true;
  resetNewTask();
};

const closeModal = () => {
  isModalOpen.value = false;
};

const resetNewTask = () => {
  newTask.value = {
    idTask: 0,
    descripcion: '',
    tipoResponsable: '',
    fechaEntrega: '',
    fechaVerificacion: ''
  };
};

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

// Función para agregar una nueva tarea
const submitForm = () => {
  if (newTask.value.descripcion && newTask.value.tipoResponsable && newTask.value.fechaEntrega && newTask.value.fechaVerificacion) {
    const newId = tasks.value.length + 1; // Generar un nuevo ID
    tasks.value.push({ idTask: newId, ...newTask.value });
    closeModal();
  } else {
    alert('Por favor, completa todos los campos.');
  }
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px; /* Ajusta el ancho del modal según tus necesidades */
}
</style>
