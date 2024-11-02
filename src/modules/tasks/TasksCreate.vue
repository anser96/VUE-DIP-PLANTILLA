<template>
  <div>
    <button @click="openModal" class="btn btn-primary">Crear Nueva Tarea</button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea' }}</h1>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Campo para la Descripción -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              id="description"
              v-model="newTask.description"
              class="input input-bordered w-full"
              placeholder="Ingrese la descripción"
              required
            />
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
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
            <p v-if="errors.tipoResponsable" class="text-red-500 text-sm mt-1">{{ errors.tipoResponsable }}</p>
          </div>

          <!-- Campo para el ID del Responsable -->
          <div>
            <label for="responsableId" class="block text-sm font-medium text-gray-700">ID del Responsable</label>
            <input
              type="number"
              id="responsableId"
              v-model="newTask.responsableId"
              class="input input-bordered w-full"
              placeholder="Ingrese el ID del responsable"
              required
            />
            <p v-if="errors.responsableId" class="text-red-500 text-sm mt-1">{{ errors.responsableId }}</p>
          </div>

          <!-- Campo para la Fecha de Entrega -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
            <input
              type="date"
              id="dueDate"
              v-model="newTask.dueDate"
              class="input input-bordered w-full"
              required
            />
            <p v-if="errors.dueDate" class="text-red-500 text-sm mt-1">{{ errors.dueDate }}</p>
          </div>

          <!-- Campo para la Fecha de Verificación -->
          <div>
            <label for="verificationDate" class="block text-sm font-medium text-gray-700">Fecha de Verificación</label>
            <input
              type="date"
              id="verificationDate"
              v-model="newTask.verificationDate"
              class="input input-bordered w-full"
              required
            />
            <p v-if="errors.verificationDate" class="text-red-500 text-sm mt-1">{{ errors.verificationDate }}</p>
          </div>

          <!-- Botón de Crear o Actualizar -->
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Tarea' : 'Crear Tarea' }}</button>
          </div>
        </form>

        <button @click="closeModal" class="btn btn-secondary mt-4">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const newTask = ref({
  description: '',
  sessionId: 0,
  dueDate: '',
  verificationDate: '',
  tipoResponsable: '', 
  responsableId: 0 
});

const errors = ref({
  description: '',
  sessionId: '',
  dueDate: '',
  verificationDate: '',
  tipoResponsable: '',
  responsableId: ''
});

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const taskId = ref<number | null>(null);
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
  resetForm();
};

const closeModal = () => {
  isModalOpen.value = false;
};

const resetForm = () => {
  newTask.value = {
    description: '',
    sessionId: 0,
    dueDate: '',
    verificationDate: '',
    tipoResponsable: '',
    responsableId: 0
  };
  errors.value = {
    description: '',
    sessionId: '',
    dueDate: '',
    verificationDate: '',
    tipoResponsable: '',
    responsableId: ''
  };
  isEditing.value = false;
};

onMounted(() => {
  taskId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  isEditing.value = taskId.value !== null;

  if (isEditing.value && taskId.value !== null) {
    // Aquí debes obtener la tarea desde el backend si estás en modo edición
    axios.get(`http://localhost:8080/api/tasks/${taskId.value}`)
      .then(response => {
        newTask.value = response.data;
      });
  }
});

const validateFields = () => {
  let isValid = true;
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = '';
  });

  if (!newTask.value.description) {
    errors.value.description = 'La descripción es requerida.';
    isValid = false;
  }

  if (!newTask.value.tipoResponsable) {
    errors.value.tipoResponsable = 'El tipo de responsable es requerido.';
    isValid = false;
  }

  if (!newTask.value.responsableId || newTask.value.responsableId <= 0) {
    errors.value.responsableId = 'El ID del responsable es requerido y debe ser mayor que 0.';
    isValid = false;
  }

  if (!newTask.value.dueDate) {
    errors.value.dueDate = 'La fecha de entrega es requerida.';
    isValid = false;
  }

  if (!newTask.value.verificationDate) {
    errors.value.verificationDate = 'La fecha de verificación es requerida.';
    isValid = false;
  }

  return isValid;
};

const submitForm = () => {
  if (!validateFields()) {
    return;
  }

  const taskData = { ...newTask.value };

  if (isEditing.value && taskId.value !== null) {
    axios.put(`http://localhost:8080/api/tasks/${taskId.value}`, taskData)
      .then(() => {
        closeModal();
        router.push('/tasks');
      })
      .catch(error => console.error(error));
  } else {
    axios.post('http://localhost:8080/api/tasks', taskData)
      .then(() => {
        closeModal();
        router.push('/tasks');
      })
      .catch(error => console.error(error));
  }
};
</script>

<style scoped>
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
  width: 400px;
}
.text-red-500 {
  color: red;
}
</style>
