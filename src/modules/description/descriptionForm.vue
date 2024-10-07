<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isEditing ? 'Editar Descripción' : 'Crear Nueva Descripción' }}</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para los Estudiantes Implicados -->
      <div>
        <label for="estuImplicados" class="block text-sm font-medium text-gray-700">Estudiantes Implicados</label>
        <input
          type="text"
          id="estuImplicados"
          v-model="description.ESTU_IMPLICADOS"
          class="input input-bordered w-full"
          placeholder="Ingrese los nombres de los estudiantes"
          required
        />
      </div>

      <!-- Campo para el Número de Estudiantes Implicados -->
      <div>
        <label for="numEstuImplicados" class="block text-sm font-medium text-gray-700">Número de Estudiantes Implicados</label>
        <input
          type="number"
          id="numEstuImplicados"
          v-model="description.NUM_ESTU_IMPLICADOS"
          class="input input-bordered w-full"
          placeholder="Ingrese el número de estudiantes"
          required
        />
      </div>

      <!-- Campo para los Docentes Implicados -->
      <div>
        <label for="docenImplicados" class="block text-sm font-medium text-gray-700">Docentes Implicados</label>
        <input
          type="text"
          id="docenImplicados"
          v-model="description.DOCEN_IMPLICADOS"
          class="input input-bordered w-full"
          placeholder="Ingrese los nombres de los docentes"
          required
        />
      </div>

      <!-- Campo para el Número de Docentes Implicados -->
      <div>
        <label for="numDocenImplicados" class="block text-sm font-medium text-gray-700">Número de Docentes Implicados</label>
        <input
          type="number"
          id="numDocenImplicados"
          v-model="description.NUM_DOCEN_IMPLICADOS"
          class="input input-bordered w-full"
          placeholder="Ingrese el número de docentes"
          required
        />
      </div>

      <!-- Campo para la Ciudad Implicada -->
      <div>
        <label for="cuidadImplicada" class="block text-sm font-medium text-gray-700">Ciudad Implicada</label>
        <input
          type="text"
          id="cuidadImplicada"
          v-model="description.CUIDAD_IMPLICADA"
          class="input input-bordered w-full"
          placeholder="Ingrese la ciudad"
          required
        />
      </div>

      <!-- Campo para el País Implicado -->
      <div>
        <label for="paisImplicado" class="block text-sm font-medium text-gray-700">País Implicado</label>
        <input
          type="text"
          id="paisImplicado"
          v-model="description.PAIS_IMPLICADO"
          class="input input-bordered w-full"
          placeholder="Ingrese el país"
          required
        />
      </div>

      <!-- Campo para el Evento -->
      <div>
        <label for="evento" class="block text-sm font-medium text-gray-700">Evento</label>
        <input
          type="text"
          id="evento"
          v-model="description.EVENTO"
          class="input input-bordered w-full"
          placeholder="Ingrese el nombre del evento"
          required
        />
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Descripción' : 'Crear Descripción' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Lista de descripciones simuladas
const descriptions = ref([
  { ID_DESCRIPCION: 1, ESTU_IMPLICADOS: 'Juan Pérez, Maria Lopez', NUM_ESTU_IMPLICADOS: 2, DOCEN_IMPLICADOS: 'Carlos García', NUM_DOCEN_IMPLICADOS: 1, CUIDAD_IMPLICADA: 'Bogotá', PAIS_IMPLICADO: 'Colombia', EVENTO: 'Congreso Nacional de Ciencias' },
  { ID_DESCRIPCION: 2, ESTU_IMPLICADOS: 'Ana Martinez, José Rodriguez', NUM_ESTU_IMPLICADOS: 2, DOCEN_IMPLICADOS: 'Laura Gómez', NUM_DOCEN_IMPLICADOS: 1, CUIDAD_IMPLICADA: 'Medellín', PAIS_IMPLICADO: 'Colombia', EVENTO: 'Feria de Innovación' }
]);

// Datos de la descripción
const description = ref({
  ID_DESCRIPCION: 0,
  ESTU_IMPLICADOS: '',
  NUM_ESTU_IMPLICADOS: 0,
  DOCEN_IMPLICADOS: '',
  NUM_DOCEN_IMPLICADOS: 0,
  CUIDAD_IMPLICADA: '',
  PAIS_IMPLICADO: '',
  EVENTO: ''
});

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const descriptionId = ref<number | null>(null);

// Si es modo edición, cargar los datos de la descripción existente
onMounted(() => {
  descriptionId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  isEditing.value = descriptionId.value !== null;

  if (isEditing.value && descriptionId.value !== null) {
    const existingDescription = descriptions.value.find(d => d.ID_DESCRIPCION === descriptionId.value);
    if (existingDescription) {
      description.value = { ...existingDescription };
    }
  }
});

const submitForm = () => {
  if (isEditing.value && descriptionId.value !== null) {
    // Actualizar descripción existente
    const index = descriptions.value.findIndex(d => d.ID_DESCRIPCION === descriptionId.value);
    if (index !== -1) {
      descriptions.value[index] = { ...description.value };
    }
  } else {
    // Crear nueva descripción
    descriptions.value.push({ ...description.value });
  }
  router.push('/descriptions');
};
</script>

<style scoped>
.input {
  margin-top: 4px;
}
</style>
