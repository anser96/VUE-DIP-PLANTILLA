<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Sesión' : 'Crear Nueva Sesión' }}</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para la Ubicación -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
        <input
          type="text"
          id="location"
          v-model="newSession.location"
          class="input input-bordered w-full"
          placeholder="Ingrese la ubicación"
          required
        />
        <p v-if="errors.location" class="text-red-500 text-sm mt-1">{{ errors.location }}</p>
      </div>

      <!-- Campo para la Fecha -->
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700">Fecha</label>
        <input
          type="date"
          id="date"
          v-model="newSession.date"
          class="input input-bordered w-full"
          required
        />
        <p v-if="errors.date" class="text-red-500 text-sm mt-1">{{ errors.date }}</p>
      </div>

      <!-- Campo para la Hora de Inicio -->
      <div>
        <label for="startTime" class="block text-sm font-medium text-gray-700">Hora de Inicio</label>
        <input
          type="time"
          id="startTime"
          v-model="newSession.startTime"
          class="input input-bordered w-full"
          required
        />
        <p v-if="errors.startTime" class="text-red-500 text-sm mt-1">{{ errors.startTime }}</p>
      </div>

      <!-- Campo para la Hora de Fin -->
      <div>
        <label for="endTime" class="block text-sm font-medium text-gray-700">Hora de Fin</label>
        <input
          type="time"
          id="endTime"
          v-model="newSession.endTime"
          class="input input-bordered w-full"
          required
        />
        <p v-if="errors.endTime" class="text-red-500 text-sm mt-1">{{ errors.endTime }}</p>
      </div>

      <!-- Campo para el Presidente -->
      <div>
        <label for="president" class="block text-sm font-medium text-gray-700">Presidente</label>
        <input
          type="text"
          id="president"
          v-model="newSession.president"
          class="input input-bordered w-full"
          placeholder="Ingrese el nombre del presidente"
          required
        />
        <p v-if="errors.president" class="text-red-500 text-sm mt-1">{{ errors.president }}</p>
      </div>

      <!-- Campo para el Secretario -->
      <div>
        <label for="secretary" class="block text-sm font-medium text-gray-700">Secretario</label>
        <input
          type="text"
          id="secretary"
          v-model="newSession.secretary"
          class="input input-bordered w-full"
          placeholder="Ingrese el nombre del secretario"
          required
        />
        <p v-if="errors.secretary" class="text-red-500 text-sm mt-1">{{ errors.secretary }}</p>
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Sesión' : 'Crear Sesión' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const sessions = ref([
  { idSession: 1, location: 'Sala de Conferencias', date: '2024-09-28', startTime: '08:00:00', endTime: '12:00:00', president: 'John Doe', secretary: 'Jane Smith' },
  { idSession: 2, location: 'Auditorio Principal', date: '2024-10-03', startTime: '09:00:00', endTime: '13:00:00', president: 'Alice Johnson', secretary: 'Bob Brown' }
]);

// Referencia para los datos de la nueva sesión
const newSession = ref({
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  president: '',
  secretary: '',
});

const errors = ref({
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  president: '',
  secretary: '',
});

// Detectar si estamos en modo de edición
const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const sessionId = ref<number | null>(null);

onMounted(() => {
  sessionId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  isEditing.value = sessionId.value !== null;

  if (isEditing.value && sessionId.value !== null) {
    // Cargar los datos de la sesión a editar
    const session = sessions.value.find(s => s.idSession === sessionId.value);
    if (session) {
      newSession.value = { ...session };
    }
  }
});

const validateFields = () => {
  let isValid = true;

  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = '';
  });

  if (!newSession.value.location) {
    errors.value.location = 'La ubicación es obligatoria.';
    isValid = false;
  }

  if (!newSession.value.date) {
    errors.value.date = 'La fecha es obligatoria.';
    isValid = false;
  }

  if (!newSession.value.startTime) {
    errors.value.startTime = 'La hora de inicio es obligatoria.';
    isValid = false;
  }

  if (!newSession.value.endTime) {
    errors.value.endTime = 'La hora de fin es obligatoria.';
    isValid = false;
  } else if (newSession.value.startTime >= newSession.value.endTime) {
    errors.value.endTime = 'La hora de fin debe ser posterior a la hora de inicio.';
    isValid = false;
  }

  if (!newSession.value.president) {
    errors.value.president = 'El nombre del presidente es obligatorio.';
    isValid = false;
  }

  if (!newSession.value.secretary) {
    errors.value.secretary = 'El nombre del secretario es obligatorio.';
    isValid = false;
  }

  return isValid;
};

const submitForm = () => {
  if (!validateFields()) {
    return;
  }

  if (isEditing.value && sessionId.value !== null) {
    // Actualizar sesión existente
    const index = sessions.value.findIndex(session => session.idSession === sessionId.value);
    if (index !== -1) {
      sessions.value[index] = { idSession: sessionId.value, ...newSession.value };
    }
  } else {
    // Crear nueva sesión
    const newId = sessions.value.length + 1;
    sessions.value.push({ idSession: newId, ...newSession.value });
  }

  router.push('/sessions');
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
