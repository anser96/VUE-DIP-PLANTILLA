<template>
  <div class="acta-detalle p-4 space-y-8">
    <h1 class="text-4xl font-bold mb-6 text-primary flex items-center space-x-2">
      <UserIcon class="w-8 h-8 text-secondary" /> 
      <span>Acta de Consejo y Comité Institucional</span>
    </h1>

    <!-- Steps Navigation -->
    <div class="steps steps-vertical lg:steps-horizontal w-full mb-4 space-y-2 lg:space-y-0 lg:space-x-2">
      <button :class="{ 'step-primary': currentStep >= 1 }" class="step">Encabezado</button>
      <button :class="{ 'step-primary': currentStep >= 2 }" class="step">Verificación de Quórum</button>
      <button :class="{ 'step-primary': currentStep >= 3 }" class="step">Asistentes Invitados</button>
      <button :class="{ 'step-primary': currentStep >= 4 }" class="step">Orden del Día</button>
      <button :class="{ 'step-primary': currentStep >= 5 }" class="step">Solicitudes</button>
      <button :class="{ 'step-primary': currentStep >= 6 }" class="step">Tareas o Compromisos</button>
      <button :class="{ 'step-primary': currentStep >= 7 }" class="step">Próxima Sesión</button>
      <button :class="{ 'step-primary': currentStep >= 8 }" class="step">Resumen General</button>
    </div>

    <!-- Conditional Rendering per Step -->
    <transition name="fade" mode="out-in">
      <!-- Step: Encabezado -->
      <div v-if="currentStep === 1" key="step1" class="bg-base-100 p-6 rounded-lg shadow space-y-2">
        <h2 class="text-2xl font-semibold mb-4 text-secondary flex items-center space-x-2">
          <ClipboardDocumentIcon class="w-6 h-6" /> 
          <span>Encabezado de Acta</span>
        </h2>
        <p><strong>Número de Acta:</strong> {{ acta?.idActa || "No asignado" }}</p>
        <p><strong>Estado:</strong> <span :class="getEstadoBadge(acta?.estado)">{{ acta?.estado || "Sin estado" }}</span></p>
        <p><strong>Lugar:</strong> {{ acta?.sesion.lugar || "Lugar no especificado" }}</p>
        <p><strong>Fecha:</strong> {{ acta?.sesion.fecha || "Fecha no disponible" }}</p>
        <p><strong>Hora de Inicio:</strong> {{ acta?.sesion.horaInicio || "Hora no especificada" }}</p>
        <p><strong>Hora de Fin:</strong> {{ acta?.sesion.horaFinal || "Hora no especificada" }}</p>
      </div>

      <!-- Step: Verificación de Quórum -->
      <div v-else-if="currentStep === 2" key="step2" class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-secondary flex items-center space-x-2">
          <UserGroupIcon class="w-6 h-6" /> 
          <span>Verificación de Quórum</span>
        </h2>
        <table class="table w-full rounded-lg bg-base-200 shadow-lg">
          <thead class="bg-primary text-primary-content">
            <tr>
              <th>Cargo</th>
              <th>Nombre</th>
              <th>Asistió</th>
              <th>No Asistió</th>
              <th>Excusa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="acta?.sesion.asistenciaMiembros?.length" v-for="miembro in acta?.sesion.asistenciaMiembros" :key="miembro.idMiembro" class="hover:bg-base-100">
              <td>{{ miembro.cargo }}</td>
              <td>{{ miembro.nombre }}</td>
              <td>{{ miembro.estadoAsistencia === 'Asistió' ? '✔' : '' }}</td>
              <td>{{ miembro.estadoAsistencia === 'No Asistió' ? '✖' : '' }}</td>
              <td>{{ miembro.estadoAsistencia === 'Excusa' ? '⚠️' : '' }}</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">No hay datos de quórum disponibles</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Step: Asistentes Invitados -->
      <div v-else-if="currentStep === 3" key="step3" class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-secondary flex items-center space-x-2">
          <UserPlusIcon class="w-6 h-6" /> 
          <span>Asistentes Invitados</span>
        </h2>
        <ul v-if="acta?.sesion.asistenciaInvitados?.length">
          <li v-for="invitado in acta?.sesion.asistenciaInvitados" :key="invitado.idInvitado">
            {{ invitado.nombre }} - {{ invitado.dependencia }}
          </li>
        </ul>
        <p v-else class="text-center">No hay invitados en esta sesión</p>
      </div>

      <!-- Step: Orden del Día -->
      <div v-else-if="currentStep === 4" key="step4" class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-secondary flex items-center space-x-2">
          <ListBulletIcon class="w-6 h-6" /> 
          <span>Orden del Día</span>
        </h2>
        <ul v-if="acta?.sesion.contenido">
          <li>1. Verificación del Quórum</li>
          <li>2. Aprobación del Orden del Día</li>
          <li>3. Aprobación del Acta Anterior</li>
          <li v-for="(punto, index) in acta?.sesion.contenido.split(';')" :key="index">
            {{ index + 4 }}. {{ punto || 'Punto sin especificar' }}
          </li>
        </ul>
        <p v-else class="text-center">No hay puntos en el orden del día</p>
      </div>


      <!-- Step: Solicitudes -->
      <div v-else-if="currentStep === 5" key="step5" class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-secondary flex items-center space-x-2">
          <UserGroupIcon class="w-6 h-6" /> 
          <span>Solicitudes y Correspondencia</span>
        </h2>
        <table class="table w-full rounded-lg bg-base-200 shadow-lg">
          <thead class="bg-primary text-primary-content">
            <tr>
              <th>Nombre</th>
              <th>Asunto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="acta?.sesion.solicitudes?.length" v-for="solicitudes in acta?.sesion.solicitudes" :key="solicitudes.idSolicitud" class="hover:bg-base-100">
              <td>{{ solicitudes.nombreSolicitante }}</td>
              <td>{{ solicitudes.asunto }}</td>
              <td>{{ solicitudes.estado }}</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">No hay Solicitudes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Step: Tareas -->
      <div v-else-if="currentStep === 6" key="step6" class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-secondary flex items-center space-x-2">
          <UserGroupIcon class="w-6 h-6" /> 
          <span>Tareas</span>
        </h2>
        <table class="table w-full rounded-lg bg-base-200 shadow-lg">
          <thead class="bg-primary text-primary-content">
            <tr>
              <th>Responsable</th>
              <th>Descripción</th>
              <th>fechaEntrega</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="acta?.sesion.tareas?.length" v-for="tareas in acta?.sesion.tareas" :key="tareas.idTarea" class="hover:bg-base-100">
              <td>{{ tareas.responsable }}</td>
              <td>{{ tareas.descripcion }}</td>
              <td>{{ tareas.fechaEntrega }}</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">No hay Tareas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Additional Steps and Resumen General here with similar structure -->

      <!-- Step: Resumen General -->
      <div v-else-if="currentStep === 8" key="step8" class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-primary flex items-center space-x-2">
          <ClipboardDocumentCheckIcon class="w-6 h-6" /> 
          <span>Resumen General</span>
        </h2>
        <p class="mb-4">Revisión completa del Acta con toda la información detallada de cada sección:</p>

        <!-- Mostrar la información completa en el resumen -->
        <div class="space-y-4">
          <h3 class="font-semibold text-lg">Encabezado</h3>
          <p>Número de Acta: {{ acta?.numeroActa || "No asignado" }}</p>
          <p>Estado: <span :class="getEstadoBadge(acta?.estado)">{{ acta?.estado || "Sin estado" }}</span></p>
          <p>Lugar: {{ acta?.sesion.lugar || "No especificado" }}</p>
          <p>Fecha: {{ acta?.sesion.fecha || "Fecha no disponible" }}</p>
          <p>Hora de Inicio: {{ acta?.sesion.horaInicio || "Hora no especificada" }}</p>
          <p>Hora de Fin: {{ acta?.sesion.horaFinal || "Hora no especificada" }}</p>
        </div>

        <progress class="progress progress-primary w-full" value="100" max="100"></progress>
      </div>
    </transition>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <button
        class="btn btn-outline btn-secondary"
        @click="currentStep--"
        :disabled="currentStep === 1"
      >
        Anterior
      </button>
      <button
        class="btn btn-primary"
        @click="nextStep"
      >
        {{ currentStep < 8 ? 'Siguiente' : 'Finalizar' }}
      </button>
    </div>

    <router-link to="/acts" class="btn btn-secondary mt-8">Volver a la lista de actas</router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getActaById } from '../../services/actaService';
import { ActaDetail } from '../../Utils/Interfaces/MeetingRecords';
import { 
  UserIcon, ClipboardDocumentIcon, UserGroupIcon, UserPlusIcon, 
  ListBulletIcon, ClipboardDocumentCheckIcon 
} from '@heroicons/vue/24/solid';

const route = useRoute();
const acta = ref<ActaDetail | null>(null);
const currentStep = ref(1);

const loadActaDetail = async () => {
  const id = Number(route.params.id);
  if (!isNaN(id)) {
    try {
      const response = await getActaById(id);
      acta.value = response.data || null;
    } catch (error) {
      console.error(`Error al cargar el detalle de la acta con ID ${id}:`, error);
    }
  }
};

// Function for determining badge style based on the status
const getEstadoBadge = (estado: string | undefined) => {
  return estado === 'Aprobada' ? 'badge badge-success' : estado === 'Pendiente' ? 'badge badge-warning' : 'badge badge-error';
};

// Move to next step, or finish if on the last step
const nextStep = () => {
  if (currentStep.value < 8) {
    currentStep.value++;
  }
};

onMounted(() => {
  loadActaDetail();
});
</script>

<style scoped>
.acta-detalle {
  padding: 16px;
}
.table-auto th,
.table-auto td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
