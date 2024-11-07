<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">{{ isReadOnly ? 'Ver Solicitud' : 'Crear Nueva Solicitud' }}</h1>

    <form v-if="solicitud" @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="dependencia" class="block text-sm font-medium text-gray-700">Dependencia</label>
        <input
        v-if="!isReadOnly"
          type="text"
          id="dependencia"
          v-model="solicitud.dependencia"
          :disabled="isReadOnly"
          class="input input-bordered w-full"
          placeholder="Ingrese la dependencia"
          required
        />
        <p v-if="isReadOnly" class="mt-2 text-gray-900">{{ solicitud.dependencia}}</p>
        <p v-if="errors.dependencia" class="text-red-500 text-sm mt-1">{{ errors.dependencia }}</p>
      </div>

      <div>
        <label for="asunto" class="block text-sm font-medium text-gray-700">Asunto</label>
        <input
        v-if="!isReadOnly"
          type="text"
          id="asunto"
          v-model="solicitud.asunto"
          :disabled="isReadOnly"
          class="input input-bordered w-full"
          placeholder="Ingrese el asunto"
          required
        />
        <p v-if="isReadOnly" class="mt-2 text-gray-900">{{ solicitud.asunto}}</p>
        <p v-if="errors.asunto" class="text-red-500 text-sm mt-1">{{ errors.asunto }}</p>
      </div>

      <div>
        <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripcion</label>
        <input
        v-if="!isReadOnly"
          type="text"
          id="descripcion"
          v-model="solicitud.descripcion"
          :disabled="isReadOnly"
          class="input input-bordered w-full"
          placeholder="Ingrese la descripcion"
          required
        />
        <p v-if="isReadOnly" class="mt-2 text-gray-900">{{ solicitud.descripcion}}</p>
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
      </div>

      <div>
        <label for="miembro" class="block text-sm font-medium text-gray-700">Miembro</label>
        
        <!-- Si es de solo lectura, aplica un estilo similar al input para mantener la alineación -->
        <div v-if="isReadOnly" :disabled="isReadOnly"  class=" mt-2 text-gray-900 ">
          {{ members.find(m => m.idMiembro === solicitud.idSolicitante)?.nombre || 'N/A' }}
        </div>
        
        <!-- Si no es solo lectura, muestra el select -->
        <div v-else>
          <select
            id="miembro"
            v-model="solicitud.idSolicitante"
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
      </div>


      <div v-if="!isReadOnly">
        <label for="Sesion" class="block text-sm font-medium text-gray-700">Sesion</label>
        <div >
          <select
            id="Sesion"
            v-model="solicitud.sesion.idSesion"
            class="input input-bordered w-full"
            required
          >
            <option disabled value="">Seleccione una sesion</option>
            <option v-for="sesion in sessions" :key="sesion.idSesion" :value="sesion.idSesion">
              {{ sesion.lugar }}
            </option>
          </select>
          <p v-if="errors.idSolicitante" class="text-red-500 text-sm mt-1">{{ errors.idSolicitante }}</p>
        </div>
      </div>


      <div>
        <label for="tipoSolicitante" class="block text-sm font-medium text-gray-700">Tipo Solicitante</label>
        <input
        v-if="!isReadOnly"
          type="text"
          id="asunto"
          v-model="solicitud.tipoSolicitante"
          :disabled="isReadOnly"
          class="input input-bordered w-full"
          placeholder="Ingrese el tipo de solicitante"
          required
        />
        <p v-if="isReadOnly" class="mt-2 text-gray-900">{{ solicitud.tipoSolicitante}}</p>
        <p v-if="errors.tipoSolicitante" class="text-red-500 text-sm mt-1">{{ errors.tipoSolicitante }}</p>
      </div>

      <div>
        <label for="fechaDeSolicitud" class="block text-sm font-medium text-gray-700">Fecha de Solicitud</label>
        <div v-if="isReadOnly" :disabled="isReadOnly"  class="mt-2 text-gray-900 ">
          {{ solicitud.fechaDeSolicitud }}
        </div>
        <input
        v-else
          type="date"
          id="fechaDeSolicitud"
          v-model="solicitud.fechaDeSolicitud"
          :disabled="isReadOnly"
          class="input input-bordered w-full"
          required
        />
        <p v-if="errors.fechaDeSolicitud" class="text-red-500 text-sm mt-1">{{ errors.fechaDeSolicitud }}</p>
      </div>

      <div v-if="isReadOnly">
        <label for="fechaDeSolicitud" class="block text-sm font-medium text-gray-700">Estado Solicitud</label>
        <div v-if="isReadOnly" :disabled="isReadOnly"  class="mt-2 text-gray-900">
          {{ solicitud.estado }}
        </div>
      </div>

      <div class="flex justify-end" v-if="!isReadOnly">
        <button type="submit" class="btn btn-primary">Crear Solicitud</button>
      </div>
    </form>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createSolicitud, getSolicitudById } from '../../services/solicitudServices';
import {  getSesiones } from '../../services/sesionServices';
import { getMiembros } from "../../services/miembroService";
import type { Miembro, ApiResponse, Solicitud, Sesion } from "../../Utils/Interfaces/MeetingRecords";

// Recibe el prop 'mode' para distinguir entre modos
const props = defineProps<{ mode: 'create' | 'view' }>();

// Datos de la solicitud, pueden ser nuevos o cargados
const solicitud = ref<Solicitud | null>(null);
const members = ref<Miembro[]>([]);
const sessions = ref<Sesion[]>([]);
const errors = ref({
  dependencia: '',
  asunto: '',
  descripcion: '',
  fechaDeSolicitud: '',
  idSolicitante: 0,
  tipoSolicitante:''
});

const route = useRoute();
const router = useRouter();

// Detecta si es modo de solo lectura basado en el prop `mode`
const isReadOnly = props.mode === 'view';

onMounted(async () => {
  try {
    // Cargar lista de miembros
    const response: ApiResponse<Miembro[]> = await getMiembros();
    members.value = Array.isArray(response) ? response : response.data ?? [];

    const response1: ApiResponse<Sesion[]> = await getSesiones();
      sessions.value = response1.data ?? [];

    // En modo "view", cargar los datos de la solicitud existente
    if (isReadOnly && route.params.id) {
      const solicitudData = await getSolicitudById(Number(route.params.id));
      solicitudData.fechaDeSolicitud = formatDate(solicitudData.fechaDeSolicitud);
      solicitud.value = solicitudData;
    } else {
      // Si estamos en modo creación, inicializar con datos en blanco
      solicitud.value = {
        dependencia: '',
        asunto: '',
        estado: 'PENDIENTE',
        descripcion: '',
        fechaDeSolicitud: '',
        respuesta: 'Resp',
        tipoSolicitante: '',
        idSolicitante: '',
        sesion: { idSesion: '' },
      };
    }
  } catch (error) {
    console.error("Error al cargar los miembros o la solicitud o sesiones:", error);
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Función para crear la solicitud solo si no estamos en modo de solo lectura
const submitForm = async () => {
  if (isReadOnly) return;

  try {
    await createSolicitud(solicitud.value!);
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
