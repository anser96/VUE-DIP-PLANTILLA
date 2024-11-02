<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea' }}</h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para la Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            v-model="newTask.description"
            class="input input-bordered w-full"
            placeholder="Enter the description"
            required
          />
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>

        <!-- Campo para el ID de la Sesión
        <div>
          <label for="sessionId" class="block text-sm font-medium text-gray-700">Session ID</label>
          <input
            type="number"
            id="sessionId"
            v-model="newTask.sessionId"
            class="input input-bordered w-full"
            placeholder="Enter the session ID"
            required
          />
          <p v-if="errors.sessionId" class="text-red-500 text-sm mt-1">{{ errors.sessionId }}</p>
        </div>-->

        <!-- Campo para la Fecha de Entrega -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
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
          <label for="verificationDate" class="block text-sm font-medium text-gray-700">Verification Date</label>
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
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Task' : 'Create Task' }}</button>
        </div>
      </form>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  // Lista de tareas simuladas
  const tasks = ref([
    { idTask: 1, description: 'Task 1 description', sessionId: 1, dueDate: '2024-10-10', verificationDate: '2024-10-15' },
    { idTask: 2, description: 'Task 2 description', sessionId: 2, dueDate: '2024-11-01', verificationDate: '2024-11-05' }
  ]);

  // Datos de la nueva tarea
  const newTask = ref({
    description: '',
    sessionId: 0,
    dueDate: '',
    verificationDate: ''
  });

  const errors = ref({
    description: '',
    sessionId: '',
    dueDate: '',
    verificationDate: ''
  });

  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const taskId = ref<number | null>(null);

  // Si es modo edición, cargar los datos de la tarea existente
  onMounted(() => {
    taskId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
    isEditing.value = taskId.value !== null;

    if (isEditing.value && taskId.value !== null) {
      const task = tasks.value.find(t => t.idTask === taskId.value);
      if (task) {
        newTask.value = { ...task };
      }
    }
  });

  const validateFields = () => {
    let isValid = true;
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof typeof errors.value] = '';
    });

    if (!newTask.value.description) {
      errors.value.description = 'Description is required.';
      isValid = false;
    }

    if (!newTask.value.sessionId || newTask.value.sessionId <= 0) {
      errors.value.sessionId = 'Session ID is required and must be greater than 0.';
      isValid = false;
    }

    if (!newTask.value.dueDate) {
      errors.value.dueDate = 'Due date is required.';
      isValid = false;
    }

    if (!newTask.value.verificationDate) {
      errors.value.verificationDate = 'Verification date is required.';
      isValid = false;
    }

    return isValid;
  };

  const submitForm = () => {
    if (!validateFields()) {
      return;
    }

    if (isEditing.value && taskId.value !== null) {
      const index = tasks.value.findIndex(task => task.idTask === taskId.value);
      if (index !== -1) {
        tasks.value[index] = { idTask: taskId.value, ...newTask.value };
      }
    } else {
      const newId = tasks.value.length + 1;
      tasks.value.push({ idTask: newId, ...newTask.value });
    }

    router.push('/tasks');
  };
  </script>

  <style scoped>
  .text-red-500 {
    color: red;
  }
  </style>
