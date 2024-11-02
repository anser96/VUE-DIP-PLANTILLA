<template>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Asignación de Tarea' : 'Asignar Nueva Tarea' }}</h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Campo para el Estado -->
        <div>
          <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
          <input
            type="text"
            id="estado"
            v-model="assignment.ESTADO"
            class="input input-bordered w-full"
            placeholder="Ingrese el estado"
            required
          />
        </div>

        <!-- Campo para el ID del Miembro -->
        <div>
          <label for="memberId" class="block text-sm font-medium text-gray-700">ID del Miembro</label>
          <input
            type="number"
            id="memberId"
            v-model="assignment.MIEMBROS_IDMIEMBROS"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID del miembro"
            required
            :disabled="isEditing"
          />
        </div>

        <!-- Campo para el ID de la Tarea -->
        <div>
          <label for="taskId" class="block text-sm font-medium text-gray-700">ID de la Tarea</label>
          <input
            type="number"
            id="taskId"
            v-model="assignment.TAREAS_IDTAREAS"
            class="input input-bordered w-full"
            placeholder="Ingrese el ID de la tarea"
            required
            :disabled="isEditing"
          />
        </div>

        <!-- Botón de Crear o Actualizar -->
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Asignación' : 'Asignar Tarea' }}</button>
        </div>
      </form>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  // Lista de asignaciones de tareas simuladas
  const taskAssignments = ref([
    { ESTADO: 'En Proceso', MIEMBROS_IDMIEMBROS: 101, TAREAS_IDTAREAS: 1 },
    { ESTADO: 'Completada', MIEMBROS_IDMIEMBROS: 102, TAREAS_IDTAREAS: 2 }
  ]);

  // Datos de la asignación
  const assignment = ref({
    ESTADO: '',
    MIEMBROS_IDMIEMBROS: 0,
    TAREAS_IDTAREAS: 0
  });

  const router = useRouter();
  const route = useRoute();
  const isEditing = ref(false);
  const assignmentId = ref<{ MIEMBROS_IDMIEMBROS: number; TAREAS_IDTAREAS: number }>({
    MIEMBROS_IDMIEMBROS: 0,
    TAREAS_IDTAREAS: 0
  });

  // Si es modo edición, cargar los datos de la asignación existente
  onMounted(() => {
    assignmentId.value.MIEMBROS_IDMIEMBROS = route.params.memberId ? parseInt(route.params.memberId as string, 10) : 0;
    assignmentId.value.TAREAS_IDTAREAS = route.params.taskId ? parseInt(route.params.taskId as string, 10) : 0;

    isEditing.value = assignmentId.value.MIEMBROS_IDMIEMBROS !== 0 && assignmentId.value.TAREAS_IDTAREAS !== 0;

    if (isEditing.value) {
      const existingAssignment = taskAssignments.value.find(
        a => a.MIEMBROS_IDMIEMBROS === assignmentId.value.MIEMBROS_IDMIEMBROS && a.TAREAS_IDTAREAS === assignmentId.value.TAREAS_IDTAREAS
      );
      if (existingAssignment) {
        assignment.value = { ...existingAssignment };
      }
    }
  });

  const submitForm = () => {
    if (isEditing.value) {
      const index = taskAssignments.value.findIndex(
        a => a.MIEMBROS_IDMIEMBROS === assignment.value.MIEMBROS_IDMIEMBROS && a.TAREAS_IDTAREAS === assignment.value.TAREAS_IDTAREAS
      );
      if (index !== -1) {
        taskAssignments.value[index] = { ...assignment.value };
      }
    } else {
      taskAssignments.value.push({ ...assignment.value });
    }
    router.push('/task-assignments');
  };
  </script>

  <style scoped>
  .input {
    margin-top: 4px;
  }
  </style>
