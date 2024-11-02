<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Invitado' : 'Crear Nuevo Invitado' }}</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para el Nombre -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="name"
          v-model="newGuest.name"
          class="input input-bordered w-full"
          placeholder="Ingrese el nombre"
          required
        />
      </div>

      <!-- Campo para el Cargo -->
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700">Cargo</label>
        <input
          type="text"
          id="role"
          v-model="newGuest.role"
          class="input input-bordered w-full"
          placeholder="Ingrese el cargo"
          required
        />
      </div>

      <!-- Campo para la Asignación de Tarea -->
      <div>
        <label for="task" class="block text-sm font-medium text-gray-700">Asignar Tarea</label>
        <select id="task" v-model="selectedTask" class="input input-bordered w-full" required>
          <option value="" disabled selected>Seleccione una tarea</option>
          <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.description }}</option>
        </select>
      </div>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Invitado' : 'Crear Invitado' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const newGuest = ref({
  name: '',
  role: '',
  assignedTask: null, // Para almacenar la tarea asignada
});

const selectedTask = ref(null);
const errorMessage = ref('');

// Simulación de tareas disponibles
const tasks = ref([
  { id: 1, description: 'Tarea 1' },
  { id: 2, description: 'Tarea 2' },
]);

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);

// Si es modo edición, cargar los datos del invitado existente
onMounted(() => {
  const guestId = route.params.id; // Supón que pasas el ID del invitado en la ruta
  if (guestId) {
    isEditing.value = true;
    // Cargar los datos del invitado desde tu fuente de datos (simulado aquí)
    const existingGuest = { name: 'Jane Doe', role: 'Consultant', assignedTask: 2 }; // Datos simulados
    newGuest.value = { ...existingGuest, assignedTask: existingGuest.assignedTask };
    selectedTask.value = existingGuest.assignedTask; // Establecer la tarea seleccionada
  }
});

const submitForm = () => {
  if (!newGuest.value.name || !newGuest.value.role || !selectedTask.value) {
    errorMessage.value = 'Todos los campos son obligatorios.';
    return;
  }

  newGuest.value.assignedTask = selectedTask.value; // Asignar la tarea seleccionada

  // Lógica para guardar el nuevo invitado (puedes enviarlo a tu API o base de datos)
  console.log('Invitado creado o actualizado:', newGuest.value);

  // Redirigir después de guardar
  router.push('/guests'); // Cambia la ruta según corresponda
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
