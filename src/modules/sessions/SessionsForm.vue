<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">
      {{ isEditing ? 'Editar Sesión' : isViewing ? 'Ver Sesión' : 'Crear Nueva Sesión' }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para la Ubicación -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
        <input
          v-if="!isViewing"
          type="text"
          id="location"
          v-model="newSession.lugar"
          class="input input-bordered w-full"
          placeholder="Ingrese la ubicación"
          :disabled="isViewing"
          required
        />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.lugar }}</p>
        <p v-if="errors.lugar && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.lugar }}</p>
      </div>

      <!-- Campo para la Fecha -->
      <div>
        <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha</label>
        <input
          v-if="!isViewing"
          type="date"
          id="fecha"
          v-model="newSession.fecha"
          class="input input-bordered w-full"
          :disabled="isViewing"
          required
        />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.fecha }}</p>
        <p v-if="errors.fecha && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.fecha }}</p>
      </div>

      <!-- Campo para la Hora de Inicio -->
      <div>
        <label for="startTime" class="block text-sm font-medium text-gray-700">Hora de Inicio</label>
        <input
          v-if="!isViewing"
          type="time"
          id="startTime"
          v-model="newSession.horaInicio"
          class="input input-bordered w-full"
          :disabled="isViewing"
          required
        />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.horaInicio }}</p>
        <p v-if="errors.horaInicio && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.horaInicio }}</p>
      </div>

      <!-- Campo para la Hora de Fin -->
      <div>
        <label for="endTime" class="block text-sm font-medium text-gray-700">Hora de Fin</label>
        <input
          v-if="!isViewing"
          type="time"
          id="endTime"
          v-model="newSession.horaFinal"
          class="input input-bordered w-full"
          :disabled="isViewing"
          required
        />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.horaFinal }}</p>
        <p v-if="errors.horaFinal && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.horaFinal }}</p>
      </div>

      <!-- Campo para el Presidente -->
      <div>
        <label for="president" class="block text-sm font-medium text-gray-700">Presidente</label>
        <input
          v-if="!isViewing"
          type="text"
          id="president"
          v-model="newSession.presidente"
          class="input input-bordered w-full"
          :disabled="isViewing"
          placeholder="Ingrese el nombre del presidente"
          required
        />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.presidente }}</p>
        <p v-if="errors.presidente && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.presidente }}</p>
      </div>

      <!-- Campo para el Secretario -->
      <div>
        <label for="secretary" class="block text-sm font-medium text-gray-700">Secretario</label>
        <input
          v-if="!isViewing"
          type="text"
          id="secretary"
          v-model="newSession.secretario"
          class="input input-bordered w-full"
          :disabled="isViewing"
          placeholder="Ingrese el nombre del secretario"
          required
        />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.secretario }}</p>
        <p v-if="errors.secretario && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.secretario }}</p>
      </div>

      <!-- Campo para Contenido de la Reunión -->
      <div>
        <label for="contenido" class="block text-sm font-medium text-gray-700">Contenido de la Reunión</label>
        <textarea
          v-if="!isViewing"
          id="contenido"
          v-model="contenido"
          class="input input-bordered w-full h-32"
          placeholder="Escriba el contenido de la reunión"
          :disabled="isViewing"
        ></textarea>
        <p v-if="isViewing" class="mt-2 text-gray-900 whitespace-pre">{{ contenido }}</p>
      </div>

      <!-- Listar Invitados -->
      <div class="relative overflow-x-auto mt-6">
        <h3 class="text-xl font-semibold mb-2">Lista de Invitados</h3>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Nombre</th>
              <th scope="col" class="px-6 py-3">Dependencia</th>
              <th scope="col" class="px-6 py-3">Estado Asistencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(invitado, index) in asistenciaInvitados" :key="index" class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-gray-900">{{ invitado.nombre }}</td>
              <td class="px-6 py-4">{{ invitado.dependencia }}</td>
              <td class="px-6 py-4">{{ invitado.estadoAsistencia ?? 'PENDIENTE' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Listar Miembros -->
      <div class="relative overflow-x-auto mt-6">
        <h3 class="text-xl font-semibold mb-2">Lista de Miembros</h3>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Nombre</th>
              <th scope="col" class="px-6 py-3">Cargo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(miembro, index) in asistenciaMiembros" :key="index" class="bg-white border-b">
              <td class="px-6 py-4 font-medium text-gray-900">{{ miembro.nombre }}</td>
              <td class="px-6 py-4">{{ miembro.cargo }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botones para agregar miembros e invitados (solo en edición o creación) -->
      <div class="flex space-x-4" v-if="isEditing || !isViewing">
        <button type="button" class="btn btn-primary" @click="showInvitadosModal = true">Agregar Invitados</button>
        <button type="button" class="btn btn-primary" @click="showMiembrosModal = true">Agregar Miembros</button>
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div v-if="!isViewing" class="flex justify-end mt-6">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Sesión' : 'Crear Sesión' }}</button>
      </div>
    </form>

    <!-- Modales (solo si no estamos en modo de visualización) -->
    <InvitadosModal v-if="!isViewing" :show="showInvitadosModal" @add-invitado="addInvitado" @close="showInvitadosModal = false" />
    <MiembrosModal v-if="!isViewing" :show="showMiembrosModal" @add-miembro="addMiembro" @close="showMiembrosModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  createSession,
  updateSession,
  getSessionById,
  addAsistenciaMiembros,
  addAsistenciaInvitados,
  definirContenidoSesion,
  Session
} from '../../services/SessionServices';

import InvitadosModal from '../../components/modals/InvitadosModal.vue';
import MiembrosModal from '../../components/modals/MiembrosModal.vue';

// Define el tipo para Miembro
interface Miembro {
  idMiembro: number;
  nombre: string;
  cargo: string;
}

// Define el tipo para Invitado
interface Invitado {
  idInvitado: number;
  nombre: string;
  dependencia: string;
  estadoAsistencia: string;
}

const newSession = ref<Session>({
  lugar: '',
  fecha: '',
  horaInicio: '',
  horaFinal: '',
  presidente: '',
  secretario: '',
  contenido: null,
  asistenciaMiembros: [],
  asistenciaInvitados: [],
});

const showInvitadosModal = ref(false);
const showMiembrosModal = ref(false);

const asistenciaMiembros = ref<Miembro[]>([]);
const asistenciaInvitados = ref<Invitado[]>([]);

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const isViewing = ref(false); // Nueva propiedad para el modo vista
const sessionId = ref<number | null>(null);

// Define el contenido de la reunión como string
const contenido = ref<string>('');

const errors = ref({
  lugar: '',
  fecha: '',
  horaInicio: '',
  horaFinal: '',
  presidente: '',
  secretario: '',
});

// Función para cargar los datos en modo edición o vista
onMounted(async () => {
  sessionId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  isEditing.value = sessionId.value !== null && route.name === 'SessionsEdit';
  isViewing.value = sessionId.value !== null && route.name === 'SessionsView'; // Detectar si estamos en modo vista

  if ((isEditing.value || isViewing.value) && sessionId.value !== null) {
    try {
      const session = await getSessionById(sessionId.value);
      newSession.value = session;
      asistenciaMiembros.value = session.asistenciaMiembros || [];
      asistenciaInvitados.value = session.asistenciaInvitados || [];
      contenido.value = session.contenido || '';
    } catch (error) {
      console.error('Error al cargar la sesión y datos relacionados:', error);
    }
  }
});

// Función para agregar invitados desde el modal y hacer la petición
const addInvitado = async (invitado: Invitado) => {
  if (isViewing.value) return;
  asistenciaInvitados.value.push(invitado);
  if (sessionId.value !== null) {
    await addAsistenciaInvitados(sessionId.value, asistenciaInvitados.value);
  }
};

// Función para agregar miembros desde el modal y hacer la petición
const addMiembro = async (miembro: Miembro) => {
  if (isViewing.value) return;
  asistenciaMiembros.value.push(miembro);
  if (sessionId.value !== null) {
    await addAsistenciaMiembros(sessionId.value, asistenciaMiembros.value);
  }
};

const validateFields = () => {
  let isValid = true;
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = '';
  });

  if (!newSession.value.lugar) {
    errors.value.lugar = 'La ubicación es obligatoria.';
    isValid = false;
  }
  if (!newSession.value.fecha) {
    errors.value.fecha = 'La fecha es obligatoria.';
    isValid = false;
  }
  if (!newSession.value.horaInicio) {
    errors.value.horaInicio = 'La hora de inicio es obligatoria.';
    isValid = false;
  }
  if (!newSession.value.horaFinal) {
    errors.value.horaFinal = 'La hora de fin es obligatoria.';
    isValid = false;
  }
  if (!newSession.value.presidente) {
    errors.value.presidente = 'El nombre del presidente es obligatorio.';
    isValid = false;
  }
  if (!newSession.value.secretario) {
    errors.value.secretario = 'El nombre del secretario es obligatorio.';
    isValid = false;
  }
  return isValid;
};

const submitForm = async () => {
  if (isViewing.value) return; // No hacer nada si estamos en modo de vista
  if (!validateFields()) return;

  try {
    let sessionResponse;
    if (isEditing.value && sessionId.value !== null) {
      sessionResponse = await updateSession(sessionId.value, newSession.value);
    } else {
      sessionResponse = await createSession(newSession.value);
      sessionId.value = sessionResponse?.idSesion ?? null;
    }

    // Enviar el contenido de la reunión a la API
    if (sessionId.value !== null) {
      await definirContenidoSesion(sessionId.value, contenido.value); // Enviar contenido
    }
    router.push('/sessions');
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
};
</script>

