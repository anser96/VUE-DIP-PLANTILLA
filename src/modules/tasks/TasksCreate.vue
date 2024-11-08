<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Tarea' : 'Asignar Nueva Tarea' }}</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para la Descripción -->
      <div>
        <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
        <input type="text" id="descripcion" v-model="newTarea.descripcion" class="input input-bordered w-full"
          placeholder="Ingrese la descripción" required />
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
      </div>

      <!-- Campo para la Fecha de Entrega -->
      <div>
        <label for="fechaEntrega" class="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
        <input type="date" id="fechaEntrega" v-model="newTarea.fechaEntrega" class="input input-bordered w-full"
          required />
        <p v-if="errors.fechaEntrega" class="text-red-500 text-sm mt-1">{{ errors.fechaEntrega }}</p>
      </div>

      <!-- Campo para la Fecha de Verificación -->
      <div>
        <label for="fechaVerificacion" class="block text-sm font-medium text-gray-700">Fecha de Verificación</label>
        <input type="date" id="fechaVerificacion" v-model="newTarea.fechaVerificacion"
          class="input input-bordered w-full" required />
        <p v-if="errors.fechaVerificacion" class="text-red-500 text-sm mt-1">{{ errors.fechaVerificacion }}</p>
      </div>

      <!-- Campo para el Tipo de Responsable -->
      <div>
        <label for="tipoResponsable" class="block text-sm font-medium text-gray-700">Tipo Responsable</label>
        <input type="text" id="tipoResponsable" v-model="newTarea.tipoResponsable" class="input input-bordered w-full"
          placeholder="Ingrese el responsable" required />
        <p v-if="errors.tipoResponsable" class="text-red-500 text-sm mt-1">{{ errors.tipoResponsable }}</p>
      </div>

      <!-- Campo para el Estado -->
      <div>
        <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
        <input type="text" id="estado" v-model="newTarea.estado" class="input input-bordered w-full"
          placeholder="Ingrese el estado" required />
        <p v-if="errors.estado" class="text-red-500 text-sm mt-1">{{ errors.estado }}</p>
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Asignación' : 'Asignar Tarea'
          }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Tarea, ApiResponse } from "../../Utils/Interfaces/MeetingRecords";
import { createTarea, getTareaById, updateTarea } from "../../services/tareaServices";

// Datos de la tarea
const newTarea = ref<Tarea>({
  idTarea: 0,
  descripcion: '',
  fechaEntrega: '',
  fechaVerificacion: '',
  tipoResponsable: '',
  responsableId: 0,
  estado: '',
  responsable: '',
  asistenciaTareas: []
});

const errors = ref({
  descripcion: '',
  fechaEntrega: '',
  fechaVerificacion: '',
  tipoResponsable: '',
  estado: ''
});

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const taskId = ref<number | null>(null);

// Si es modo edición, cargar los datos de la asignación existente
onMounted(async () => {
  taskId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  isEditing.value = taskId.value !== null;

  if (isEditing.value && taskId.value !== null) {
    try {
      const response: ApiResponse<Tarea> = await getTareaById(taskId.value);
      if (response.status === "success" && response.data) {
        newTarea.value = response.data;
      } else {
        throw new Error(response.message || "Error desconocido al cargar la tarea");
      }
    } catch (error) {
      console.error("Error al cargar la tarea:", error);
    }
  }
});

// Validar campos del formulario
const validateFields = () => {
  let isValid = true;
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = '';
  });

  if (!newTarea.value.descripcion) {
    errors.value.descripcion = 'La descripcion es obligatoria.';
    isValid = false;
  }

  if (!newTarea.value.fechaEntrega) {
    errors.value.fechaEntrega = 'La fecha de entrega es obligatoria.';
    isValid = false;
  }

  if (!newTarea.value.fechaVerificacion) {
    errors.value.fechaVerificacion = 'La fecha de verificación es obligatoria.';
    isValid = false;
  }

  if (!newTarea.value.tipoResponsable) {
    errors.value.tipoResponsable = 'El tipo responsable es obligatorio.';
    isValid = false;
  }

  if (!newTarea.value.estado) {
    errors.value.estado = 'El estado es obligatorio.';
    isValid = false;
  }

  return isValid;
};

// Manejar la creación y actualización de la tarea
const submitForm = async () => {
  if (!validateFields()) {
    return;
  }

  try {
    let response: ApiResponse<Tarea>;

    if (isEditing.value && taskId.value !== null) {
      // Actualizar la tarea existente
      response = await updateTarea(taskId.value, newTarea.value);
    } else {
      // Crear nueva tarea
      response = await createTarea(newTarea.value);
      alert("La tarea se ha registrado exitosamente.");
    }

    if (response.status === "success") {

      // Redirigir a la tabla de la tarea después de la operación exitosa
      router.push("/tasks");
    } else {
      console.error("Error al guardar la tarea:", response.message);
    }
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
};
</script>

<style scoped>
.input {
  margin-top: 4px;
}
</style>
