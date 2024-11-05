<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">Crear Nueva Solicitud</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para la Dependencia -->
      <div>
        <label for="dependencia" class="block text-sm font-medium text-gray-700">Dependencia</label>
        <input
          type="text"
          id="dependencia"
          v-model="newSolicitud.dependencia"
          class="input input-bordered w-full"
          placeholder="Ingrese la dependencia"
          required
        />
        <p v-if="errors.dependencia" class="text-red-500 text-sm mt-1">{{ errors.dependencia }}</p>
      </div>

      <!-- Campo para el Asunto -->
      <div>
        <label for="asunto" class="block text-sm font-medium text-gray-700">Asunto</label>
        <input
          type="text"
          id="asunto"
          v-model="newSolicitud.asunto"
          class="input input-bordered w-full"
          placeholder="Ingrese el asunto"
          required
        />
        <p v-if="errors.asunto" class="text-red-500 text-sm mt-1">{{ errors.asunto }}</p>
      </div>
      

      <div>
        <label for="miembro" class="block text-sm font-medium text-gray-700">Seleccionar Miembro</label>
        <select
          id="miembro"
          v-model="newSolicitud.idSolicitante"
          class="input input-bordered w-full"
          required
        >
          <option disabled value="">Seleccione un miembro</option>
          <option v-for="miembro in members" :key="miembro.idMiembro" :value="miembro.idMiembro">
            {{ miembro.nombre }}
          </option>
        </select>
        <p v-if="errors.idSolicitante" class="text-red-500 text-sm mt-1">{{ errors.idSolicitante }}</p>
      </div>


      <div>
        <label for="asunto" class="block text-sm font-medium text-gray-700">Descripcion</label>
        <input
          type="text"
          id="asunto"
          v-model="newSolicitud.descripcion"
          class="input input-bordered w-full"
          placeholder="Ingrese el asunto"
          required
        />
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
      </div>

      <!-- Campo para la Fecha de Solicitud -->
      <div>
        <label for="fechaDeSolicitud" class="block text-sm font-medium text-gray-700">Fecha de Solicitud</label>
        <input
          type="date"
          id="fechaDeSolicitud"
          v-model="newSolicitud.fechaDeSolicitud"
          class="input input-bordered w-full"
          required
        />
        <p v-if="errors.fechaDeSolicitud" class="text-red-500 text-sm mt-1">{{ errors.fechaDeSolicitud }}</p>
      </div>

      <!-- Botón de Crear -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">Crear Solicitud</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { createSolicitud } from '../../services/solicitudServices';
import { getMiembros } from "../../services/miembroService";
import { Miembro, ApiResponse } from "../../Utils/Interfaces/MeetingRecords";

// Datos de la nueva solicitud
const newSolicitud = ref({
  dependencia: '',
  asunto: '',
  estado: 'PENDIENTE', 
  descripcion: '', 
  fechaDeSolicitud: '',
  respuesta: 'Resp', 
  tipoSolicitante: 'Miembro', 
  idSolicitante: '', 
  sesion: {
    idSesion: 1, 
  },
});
const members = ref<Miembro[]>([]);

const errors = ref({
  dependencia: '',
  asunto: '',
  descripcion:'',
  fechaDeSolicitud: '',
  idSolicitante:0
});


onMounted(async () => {
  try {
    const response: ApiResponse<Miembro[]> = await getMiembros();
    if (Array.isArray(response)) {
      members.value = response;
    } else if ("data" in response && Array.isArray(response.data)) {
      members.value = response.data;
    } else if ("results" in response && Array.isArray(response.results)) {
      members.value = response.results;
    } else {
      console.error("Estructura inesperada de los datos de miembros:", response);
    }
  } catch (error) {
    console.error("Error al cargar los miembros:", error);
  }
});

// Validación de campos
const validateFields = () => {
  let isValid = true;

  // Limpiar errores anteriores
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = '';
  });

  // Validar campos
  if (!newSolicitud.value.dependencia) {
    errors.value.dependencia = 'La dependencia es obligatoria.';
    isValid = false;
  }

  if (!newSolicitud.value.asunto) {
    errors.value.asunto = 'El asunto es obligatorio.';
    isValid = false;
  }

  if (!newSolicitud.value.fechaDeSolicitud) {
    errors.value.fechaDeSolicitud = 'La fecha de solicitud es obligatoria.';
    isValid = false;
  }
  if (!newSolicitud.value.idSolicitante) {
    errors.value.idSolicitante = 'El solicitante  es obligatorio.';
    isValid = false;
  }

  return isValid;
};

const router = useRouter();

const submitForm = async () => {
  if (!validateFields()) return;

  try {
    await createSolicitud(newSolicitud.value);
    await router.replace("/requests");
    window.location.reload(); // Redirigir a la lista de solicitudes después de crear
  } catch (error) {
    console.error('Error al guardar la solicitud:', error);
  }
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
