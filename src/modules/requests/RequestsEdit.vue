<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">Editar Solicitud</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para la Dependencia -->
      <div>
        <label for="dependencia" class="block text-sm font-medium text-gray-700"
          >Dependencia</label
        >
        <input
          type="text"
          id="dependencia"
          v-model="newSolicitud.dependencia"
          class="input input-bordered w-full"
          placeholder="Ingrese la dependencia"
          required
        />
        <p v-if="errors.dependencia" class="text-red-500 text-sm mt-1">
          {{ errors.dependencia }}
        </p>
      </div>

      <!-- Campo para el Asunto -->
      <div>
        <label for="asunto" class="block text-sm font-medium text-gray-700"
          >Asunto</label
        >
        <input
          type="text"
          id="asunto"
          v-model="newSolicitud.asunto"
          class="input input-bordered w-full"
          placeholder="Ingrese el asunto"
          required
        />
        <p v-if="errors.asunto" class="text-red-500 text-sm mt-1">
          {{ errors.asunto }}
        </p>
      </div>

       <!-- Campo para la Decisión -->
       <div>
        <label for="desicion" class="block text-sm font-medium text-gray-700"
          >Descripcion</label
        >
        <input
          type="text"
          id="desicion"
          v-model="newSolicitud.descripcion"
          class="input input-bordered w-full"
          placeholder="Ingrese la decisión"
          required
        />
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">
          {{ errors.descripcion }}
        </p>
      </div>

      <div>
        <label  for="miembro" class="block text-sm font-medium text-gray-700">Tipo Solicitante</label>
        <!-- Si no es solo lectura, muestra el select -->
        <div >
          <select
            id="miembro"
            v-model="newSolicitud.tipoSolicitante"
            class="input input-bordered w-full"
            required
          >
            <option  value="">Seleccione Tipo Solicitante</option>
            <option  value="miembro">Miembro</option>
            <option  value="invitado">Invitado</option>
            <option  value="usuario">Usuario</option>
          </select>
          <p v-if="errors.tipoSolicitante" class="text-red-500 text-sm mt-1">{{ errors.tipoSolicitante }}</p>
        </div>
      </div>


      <div  v-if="newSolicitud.tipoSolicitante === 'miembro'">
        <label for="miembro" class="block text-sm font-medium text-gray-700"
          >Seleccionar Miembro</label
        >
        <select
          id="miembro"
          v-model="newSolicitud.idSolicitante"
          class="input input-bordered w-full"
          required
        >
          <option disabled value="">Seleccione un miembro</option>
          <option
            v-for="miembro in members"
            :key="miembro.idMiembro"
            :value="miembro.idMiembro"
          >
            {{ miembro.nombre }}
          </option>
        </select>
        <p v-if="errors.idSolicitante" class="text-red-500 text-sm mt-1">
          {{ errors.idSolicitante }}
        </p>
      </div>

      <div v-if="newSolicitud.tipoSolicitante === 'invitado'">
        <label  for="miembro" class="block text-sm font-medium text-gray-700">Invitado</label>
        <!-- Si no es solo lectura, muestra el select -->
        <div >
          <select
            id="guests"
            v-model="newSolicitud.idSolicitante"
            class="input input-bordered w-full"
            required
          >
            <option disabled value="0">Seleccione un invitado</option>
            <option v-for="guest in guests" :key="guest.idInvitado" :value="guest.idInvitado">
              {{ guest.nombre }}
            </option>
          </select>
          <p v-if="errors.idSolicitante" class="text-red-500 text-sm mt-1">{{ errors.idSolicitante }}</p>
        </div>
      </div>

      <!-- Campo para la Fecha de Solicitud -->
      <div>
        <label
          for="fechaDeSolicitud"
          class="block text-sm font-medium text-gray-700"
          >Fecha de Solicitud</label
        >
        <input
          type="date"
          id="fechaDeSolicitud"
          v-model="newSolicitud.fechaDeSolicitud"
          class="input input-bordered w-full"
          required
        />
        <p v-if="errors.fechaDeSolicitud" class="text-red-500 text-sm mt-1">
          {{ errors.fechaDeSolicitud }}
        </p>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">
          Actualizar Solicitud
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  updateSolicitud,
  getSolicitudById,
} from "../../services/solicitudServices";
import { getMiembros } from "../../services/miembroService";
import { Miembro, ApiResponse, Invitado } from "../../Utils/Interfaces/MeetingRecords";
import { useAuthStore } from '../../store/auth'; 
import { getInvitados } from "../../services/invitadoServices";

// Datos de la solicitud que se está editando
const newSolicitud = ref({
  idSolicitud: 0,
  dependencia: "",
  asunto: "",
  estado: "PENDIENTE",
  descripcion: "",
  fechaDeSolicitud: "",
  respuesta: "Resp",
  tipoSolicitante: "Miembro",
  idSolicitante: "",
  
});
const members = ref<Miembro[]>([]);
const guests = ref<Invitado[]>([]);

// Gestión de errores de formulario
const errors = ref({
  dependencia: "",
  asunto: "",
  descripcion: "",
  fechaDeSolicitud: "",
  idSolicitante: "",
  tipoSolicitante: ""
});

// Detectar si estamos en modo de edición
const router = useRouter();
const route = useRoute();
const solicitudId = ref<number | null>(null);

onMounted(async () => {
  solicitudId.value = route.params.id
    ? parseInt(route.params.id as string, 10)
    : null;

  try {

    const response2: ApiResponse<Invitado[]> = await getInvitados();
      guests.value = Array.isArray(response2) ? response2 : response2.data ?? [];
      console.log(guests.value);

    const response: ApiResponse<Miembro[]> = await getMiembros();
    if (Array.isArray(response)) {
      members.value = response;
    } else if ("data" in response && Array.isArray(response.data)) {
      members.value = response.data;
    } else if ("results" in response && Array.isArray(response.results)) {
      members.value = response.results;
    } else {
      console.error(
        "Estructura inesperada de los datos de miembros:",
        response
      );
    }
  } catch (error) {
    console.error("Error al cargar los miembros o invitados:", error);
  }
  if (solicitudId.value !== null) {
    try {
      const response = await getSolicitudById(solicitudId.value);
      response.fechaDeSolicitud = formatDate(response.fechaDeSolicitud);
      newSolicitud.value = { ...response };
      console.log("Solicitud cargada:", newSolicitud.value);
    } catch (error) {
      console.error("Error al cargar la solicitud:", error);
    }
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const validateFields = () => {
  let isValid = true;

  // Limpiar errores anteriores
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = "";
  });

  // Validar campos
  if (!newSolicitud.value.dependencia) {
    errors.value.dependencia = "La dependencia es obligatoria.";
    isValid = false;
  }

  if (!newSolicitud.value.asunto) {
    errors.value.asunto = "El asunto es obligatorio.";
    isValid = false;
  }

  if (!newSolicitud.value.descripcion) {
    errors.value.descripcion = "La decisión es obligatoria.";
    isValid = false;
  }

  if (!newSolicitud.value.fechaDeSolicitud) {
    errors.value.fechaDeSolicitud = "La fecha de solicitud es obligatoria.";
    isValid = false;
  }
  if (!newSolicitud.value.idSolicitante) {
    errors.value.idSolicitante = "El solicitante es obligatorio.";
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateFields()) return;

  newSolicitud.value.fechaDeSolicitud = formatToCustomISO(
    newSolicitud.value.fechaDeSolicitud
  );

  // Asignar idSolicitante si es de tipo usuario
  if (newSolicitud.value?.tipoSolicitante === 'usuario') {
    const authStore = useAuthStore();
    newSolicitud.value.idSolicitante = authStore.usuario.idUsuario;
  }

  try {
    if (solicitudId.value !== null) {
      await updateSolicitud(solicitudId.value, newSolicitud.value);
      await router.replace("/requests"); // Redirigir a la lista de solicitudes
      window.location.reload();
    }
  } catch (error) {
    console.error("Error al guardar la solicitud:", error);
  }
};

const formatToCustomISO = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00.000+00:00`;
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
