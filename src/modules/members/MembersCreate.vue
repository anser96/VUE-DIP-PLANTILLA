<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Miembro' : 'Crear Nuevo Miembro' }}</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para el Nombre -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="name"
          v-model="newMember.name"
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
          v-model="newMember.role"
          class="input input-bordered w-full"
          placeholder="Ingrese el cargo"
          required
        />
      </div>

      <!-- Campo para la Asignación de Tarea -->
      <div>
        <label for="task" class="block text-sm font-medium text-gray-700">Asignar Tarea</label>
        <select id="task" v-model="selectedTask" class="input input-bordered w-full">
          <option value="" disabled selected>Seleccione una tarea</option>
          <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.description }}</option>
        </select>
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Miembro' : 'Crear Miembro' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const newMember = ref({
  name: '',
  role: ''
});

const selectedTask = ref(null);

// Simulación de tareas disponibles
const tasks = ref([
  { id: 1, description: 'Tarea 1' },
  { id: 2, description: 'Tarea 2' }
]);

const submitForm = () => {
  // Lógica para guardar el nuevo miembro
  console.log('Miembro creado:', newMember.value);
  console.log('Tarea asignada:', selectedTask.value);
};
</script>
