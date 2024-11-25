<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">
      {{ isEditing ? 'Editar sesion' : isViewing ? 'Ver sesión' : 'Crear Nueva Sesión' }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para la Ubicación -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
        <input v-if="!isViewing" type="text" id="location" v-model="newSession.lugar"
          class="input input-bordered w-full" placeholder="Ingrese la ubicación" :disabled="isViewing" required />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.lugar }}</p>
        <p v-if="errors.lugar && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.lugar }}</p>
      </div>

      <!-- Campo para la Fecha -->
      <div>
        <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha</label>
        <input v-if="!isViewing" type="date" id="fecha" v-model="newSession.fecha" class="input input-bordered w-full"
          :disabled="isViewing" required />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.fecha }}</p>
        <p v-if="errors.fecha && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.fecha }}</p>
      </div>

      <!-- Campo para la Hora de Inicio -->
      <div>
        <label for="startTime" class="block text-sm font-medium text-gray-700">Hora de Inicio</label>
        <input v-if="!isViewing" type="time" id="startTime" v-model="newSession.horaInicio"
          class="input input-bordered w-full" :disabled="isViewing" required />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.horaInicio }}</p>
        <p v-if="errors.horaInicio && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.horaInicio }}</p>
      </div>

      <!-- Campo para la Hora de Fin -->
      <div>
        <label for="endTime" class="block text-sm font-medium text-gray-700">Hora de Fin</label>
        <input v-if="!isViewing" type="time" id="endTime" v-model="newSession.horaFinal"
          class="input input-bordered w-full" :disabled="isViewing" required />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.horaFinal }}</p>
        <p v-if="errors.horaFinal && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.horaFinal }}</p>
      </div>

      <!-- Campo para el Presidente -->
      <div>
        <label for="president" class="block text-sm font-medium text-gray-700">Presidente</label>
        <input v-if="!isViewing" type="text" id="president" v-model="newSession.presidente"
          class="input input-bordered w-full" :disabled="isViewing" placeholder="Ingrese el nombre del presidente"
          required />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.presidente }}</p>
        <p v-if="errors.presidente && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.presidente }}</p>
      </div>

      <!-- Campo para el Secretario -->
      <div>
        <label for="secretary" class="block text-sm font-medium text-gray-700">Secretario</label>
        <input v-if="!isViewing" type="text" id="secretary" v-model="newSession.secretario"
          class="input input-bordered w-full" :disabled="isViewing" placeholder="Ingrese el nombre del secretario" />
        <p v-if="isViewing" class="mt-2 text-gray-900">{{ newSession.secretario }}</p>
        <p v-if="errors.secretario && !isViewing" class="text-red-500 text-sm mt-1">{{ errors.secretario }}</p>
      </div>

      <!-- Campo para Contenido de la Reunión -->
      <div>
        <label for="contenido" class="block text-sm font-medium text-gray-700">Contenido de la Reunión</label>
        <textarea v-if="!isViewing" id="contenido" v-model="contenido" class="input input-bordered w-full h-32"
          placeholder="Escriba el contenido de la reunión" :disabled="isViewing">
        </textarea>
        <p v-if="isViewing" class="mt-2 text-gray-900 whitespace-pre">{{ contenido }}</p>
      </div>

      <!-- Botones para agregar miembros e invitados (solo en edición o creación) -->
      <div class="flex space-x-4" v-if="isEditing && !isViewing">
        <button type="button" class="btn btn-primary" @click="showInvitadosModal = true">Agregar Invitados</button>
        <button type="button" class="btn btn-primary" @click="showMiembrosModal = true">Agregar Miembros</button>
      </div>

      <!-- Tabla de Miembros -->
      <div v-if="newSession.asistenciaMiembros.length > 0" class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Lista de Miembros</h2>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">Nombre</th>
              <th class="px-6 py-3">Cargo</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Estado de Asistencia</th>
              <th class="px-6 py-3">Excusa</th>
              <th class="px-6 py-3">Acciones</th>
              <!-- Nueva columna para las acciones -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(miembro, index) in newSession.asistenciaMiembros" :key="index" class="bg-white border-b">
              <td class="px-6 py-4">{{ miembro.nombre }}</td>
              <td class="px-6 py-4">{{ miembro.cargo }}</td>
              <td class="px-6 py-4">{{ miembro.email }}</td>
              <td class="px-6 py-4">
                <select v-model="miembro.estadoAsistencia" class="input input-bordered">
                  <option value="ASISTIÓ">Asistió</option>
                  <option value="EXCUSA">Excusa</option>
                  <option value="NO ASISTIÓ">No Asistió</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <input v-if="miembro.estadoAsistencia === 'EXCUSA'" v-model="miembro.excusa"
                  placeholder="Ingrese la excusa" class="input input-bordered" type="text" />
              </td>
              <td class="px-6 py-4">
                <!-- Botón para asignar tarea -->
                <button type="button"
                  @click="assignTask({ id: miembro.idMiembro, nombre: miembro.nombre, tipo: 'Miembro' })"
                  class="btn btn-primary">
                  Asignar Tarea
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tabla de Invitados -->
      <div v-if="newSession.asistenciaInvitados.length > 0" class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Lista de Invitados</h2>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">Nombre</th>
              <th class="px-6 py-3">Dependencia</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Estado de Asistencia</th>
              <!-- Nueva columna para estado de asistencia -->
              <th class="px-6 py-3">Excusa</th>
              <th class="px-6 py-3">Acciones</th>
              <!-- Nueva columna para las acciones -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(invitado, index) in newSession.asistenciaInvitados" :key="index" class="bg-white border-b">
              <td class="px-6 py-4">{{ invitado.nombre }}</td>
              <td class="px-6 py-4">{{ invitado.dependencia }}</td>
              <td class="px-6 py-4">{{ invitado.email }}</td>
              <td class="px-6 py-4">
                <select v-model="invitado.estadoAsistencia" class="input input-bordered">
                  <option value="ASISTIÓ">Asistió</option>
                  <option value="EXCUSA">Excusa</option>
                  <option value="NO ASISTIÓ">No Asistió</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <input v-if="invitado.estadoAsistencia === 'EXCUSA'" v-model="invitado.excusa"
                  placeholder="Ingrese la excusa" class="input input-bordered" type="text" />
              </td>
              <td class="px-6 py-4">
                <!-- Botón para asignar tarea -->
                <button type="button"
                  @click="assignTask({ id: invitado.idInvitado, nombre: invitado.nombre, tipo: 'Invitado' })"
                  class="btn btn-primary">
                  Asignar Tarea
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón de Verificar Quórum -->
      <div v-if="
        !isViewing &&
        isEditing &&
        (newSession.asistenciaMiembros.length > 0 || newSession.asistenciaInvitados.length > 0)
      " class="flex justify-end mt-6">
        <button type="button" @click="verificarQuorum" class="btn btn-primary">Verificar Quórum</button>
      </div>

      <!-- Botón de Crear o Actualizar Sesión -->
      <div v-if="!isViewing" class="flex justify-end mt-6">
        <button type="submit" @click="submitForm" class="btn btn-primary">
          {{ isEditing ? 'Actualizar Sesión' : 'Crear Sesión' }}
        </button>
      </div>

      <!-- Modales para invitados y miembros -->
      <InvitadosModal :show="showInvitadosModal" @add-invitado="addInvitadoToLocalList"
        @close="showInvitadosModal = false" />
      <MiembrosModal :show="showMiembrosModal" @add-miembro="addMiembroToLocalList"
        @close="showMiembrosModal = false" />

      <!-- Modal para asignar tarea -->
      <div v-if="isTaskModalVisible" class="modal-background">
        <div class="modal-content">
          <h2 class="text-2xl font-bold mb-4">Asignar Tarea a {{ selectedParticipant.nombre }}</h2>
          <label>Tareas Existentes:</label>
          <select v-model="task.idTarea" class="select">
            <option v-if="tasks.length === 0" disabled>No hay tareas por asignar</option>
            <option v-for="tarea in tasks" :key="tarea.idTarea" :value="tarea.idTarea">
              {{ tarea.descripcion }}
            </option>
          </select>

          <p class="text-xs my-2">*Si lo prefiere puede crear una nueva tarea para asignar*</p>
          <button type="button" class="btn btn-info mt-2 mb-4 btn-sm" style="display: block"
            @click="openNewTaskModal(selectedParticipant.id)">
            Nueva Tarea
          </button>

          <label>Tareas asignadas</label>
          <div class="tareas-asignadas">
            <div class="tareas-child" v-for="tarea in tareasAsignadas">
              <span>{{ tarea.idTarea }}</span>
              <span>{{ tarea.descripcion }}</span>
              <span>{{ tarea.fechaEntrega }}</span>
              <button @click="EliminarAsignacion(tarea)" class="delete">x</button>
            </div>
          </div>

          <button type="button" @click="GuardarAsignacion" class="btn btn-success mt-4">Guardar Tarea</button>
          <button type="button" @click="closeTaskModal" class="btn btn-secondary mt-4">Cerrar</button>
        </div>
      </div>

      <!-- Modal para crear tarea a asignar -->
      <div v-if="isNewTaskModalVisible" class="modal-background">
        <div class="modal-content">
          <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>

          <label>Descripción:</label>
          <input v-model="nuevaTarea.descripcion" class="input" />

          <label>Fecha de Entrega:</label>
          <input v-model="nuevaTarea.fechaEntrega" class="input" type="date" />

          <label>Fecha de Verificación:</label>
          <input v-model="nuevaTarea.fechaVerificacion" class="input" type="date" />

          <label>Tipo Responsable:</label>
          <input v-model="nuevaTarea.tipoResponsable" class="input" readonly />

          <label>ResponsableId:</label>
          <input v-model="nuevaTarea.responsableId" class="input" readonly />

          <div class="flex justify-between gap-2 mt-4">
            <button type="button" @click="closeNewTaskModal" class="btn btn-secondary">Cerrar</button>
            <button type="button" @click="submitTask" class="btn btn-success">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InvitadosModal from '../../components/modals/InvitadosModal.vue'
import MiembrosModal from '../../components/modals/MiembrosModal.vue'
import {
  addInvitadosToSesion,
  addMiembrosToSesion,
  createSesion,
  definirContenidoSesion,
  getSesionById,
  updateSesion,
  verificarQuorumEnServidor,
} from '../../services/sesionServices'
import { asignarTareaExistente, asignarTareaNueva, getTareas } from '../../services/tareaServices'
import {
  ApiResponse,
  Invitado,
  LocalTime,
  Miembro,
  QuorumEntry,
  Sesion,
  Tarea,
} from '../../Utils/Interfaces/MeetingRecords'

interface Participante {
  id: number
  nombre: string
  tipo: string
}

const localTime = ref<LocalTime>({ hour: 0, minute: 0, second: 0, nano: 0 })

const newSession = ref<Sesion>({
  lugar: '',
  fecha: '',
  horaInicio: localTime.value,
  horaFinal: localTime.value,
  presidente: '',
  secretario: '',
  contenido: '',
  asistenciaMiembros: [],
  asistenciaInvitados: [],
  idSesion: 0,
  actas: [],
  tareas: [],
  solicitudes: [],
})

const showError = ref(false)
const errorMessage = ref('')
const errors = ref<{ [key: string]: string }>({})
const showInvitadosModal = ref(false)
const showMiembrosModal = ref(false)
const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const isViewing = ref(false)
const tareasAsignadas = ref<Tarea[]>([])
const tasks = ref<Tarea[]>([])
const task = ref<Tarea>({} as Tarea)
const sessionId = ref<number | null>(null)
const contenido = ref<string>('')
const isTaskModalVisible = ref(false)
const selectedParticipant = ref<Participante>({} as Participante)
const nuevaTarea = ref<Tarea>({
  tipoResponsable: 'Invitado',
} as Tarea)
const isNewTaskModalVisible = ref(false)

onMounted(async () => {
  sessionId.value = route.params.id ? parseInt(route.params.id as string, 10) : null
  isEditing.value = sessionId.value !== null && route.name === 'SesionesEditar'
  isViewing.value = sessionId.value !== null && route.name === 'SesionesVer'

  if ((isEditing.value || isViewing.value) && sessionId.value !== null) {
    try {
      const response: ApiResponse<Sesion> = await getSesionById(sessionId.value)
      if (response.status === 'success' && response.data) {
        newSession.value = response.data
        contenido.value = response.data.contenido || ''
      } else {
        throw new Error(response.message || 'Error desconocido al cargar la sesión')
      }
    } catch (error) {
      console.error('Error al cargar la sesión:', error)
      errorMessage.value = 'Error al cargar la sesión'
      showError.value = true
    }
  }
})

const submitForm = async () => {
  if (isViewing.value) return
  try {
    let sessionResponse: ApiResponse<Sesion>
    if (isEditing.value && sessionId.value !== null) {
      sessionResponse = await updateSesion(sessionId.value, newSession.value)
    } else {
      sessionResponse = await createSesion(newSession.value)
      sessionId.value = sessionResponse?.data?.idSesion ?? null
    }

    if (sessionResponse.status === 'success' && sessionId.value !== null) {
      // Crear un Set para almacenar correos de miembros e invitados ya existentes
      const existingMiembroEmails = new Set(newSession.value.asistenciaMiembros.map((miembro) => miembro.email))
      const existingInvitadoEmails = new Set(newSession.value.asistenciaInvitados.map((invitado) => invitado.email))

      // Filtrar los miembros que aún no están en la lista y asignar estado 'pendiente' si no tiene uno
      const nuevosMiembros = newSession.value.asistenciaMiembros
        .filter((miembro) => !existingMiembroEmails.has(miembro.email))
        .map((miembro) => ({
          ...miembro,
          estadoAsistencia: miembro.estadoAsistencia || 'pendiente',
        }))

      // Filtrar los invitados que aún no están en la lista
      const nuevosInvitados = newSession.value.asistenciaInvitados.filter(
        (invitado) => !existingInvitadoEmails.has(invitado.email),
      )

      // Agregar nuevos miembros e invitados a la sesión si existen
      if (nuevosMiembros.length > 0) {
        await addMiembrosToSesion(sessionId.value, nuevosMiembros)
      }
      if (nuevosInvitados.length > 0) {
        await addInvitadosToSesion(sessionId.value, nuevosInvitados)
      }

      // Actualizar la sesión y definir contenido
      await updateSesion(sessionId.value, newSession.value)
      await definirContenidoSesion(sessionId.value, contenido.value)

      router.push('/sessions')
    } else {
      throw new Error(sessionResponse.message || 'Ocurrió un error')
    }
  } catch (error: any) {
    console.error('Error:', error)
    errorMessage.value = error.message || 'Ocurrió un error al crear la sesión'
    showError.value = true
  }
}
// Agregar invitado a la lista local y al servidor
const addInvitadoToLocalList = async (invitado: Invitado) => {
  const exists = newSession.value.asistenciaInvitados.some((i) => i.idInvitado === invitado.idInvitado)

  if (!exists) {
    newSession.value.asistenciaInvitados.push({ ...invitado, excusa: '' })
    await addInvitadosToSesion(newSession.value.idSesion!, [{ ...invitado, excusa: '' }])
  } else {
    alert('El invitado ya está en la lista.')
    console.warn('El invitado ya está en la lista.')
  }
}

// Agregar miembro a la lista local y al servidor
const addMiembroToLocalList = async (miembro: Miembro) => {
  // Verificar si el miembro ya existe en la lista local usando su `id`
  const exists = newSession.value.asistenciaMiembros.some((m) => m.idMiembro === miembro.idMiembro)

  if (!exists) {
    // Agregar miembro a la lista local y luego enviar al servidor
    newSession.value.asistenciaMiembros.push({
      ...miembro,
      estadoAsistencia: 'pendiente',
      excusa: miembro.excusa as string,
    })
    await addMiembrosToSesion(newSession.value.idSesion!, [
      { ...miembro, estadoAsistencia: '', excusa: miembro.excusa as string },
    ])
  } else {
    alert('El miembro ya está en la lista.')
    console.warn('El miembro ya está en la lista.')
  }
}

// Función para verificar quórum
const verificarQuorum = async () => {
  if (!sessionId.value) {
    console.error('ID de sesión no definido')
    return
  }
  const quorumData: QuorumEntry[] = [
    ...newSession.value.asistenciaMiembros.map(
      (miembro: any) =>
      ({
        idPersona: miembro.idMiembro,
        tipo: 'miembro',
        estadoAsistencia: miembro.estadoAsistencia,
        excusa: miembro.estadoAsistencia === 'EXCUSA' ? miembro.excusa : undefined,
      } as QuorumEntry),
    ),
    ...newSession.value.asistenciaInvitados.map((invitado: any) => ({
      idPersona: invitado.idInvitado,
      tipo: 'invitado',
      estadoAsistencia: invitado.estadoAsistencia,
      excusa: invitado.estadoAsistencia === 'EXCUSA' ? invitado.excusa : undefined,
    })),
  ] as QuorumEntry[]

  try {
    const response = await verificarQuorumEnServidor(sessionId.value, quorumData)
    console.log('Respuesta del quórum:', response)
    alert('Quórum verificado correctamente')
  } catch (error) {
    console.error('Error al verificar el quórum:', error)
    alert('Error al verificar el quórum')
  }
}

const openNewTaskModal = (idResponsable: number) => {
  nuevaTarea.value = { ...nuevaTarea.value, responsableId: idResponsable }
  isNewTaskModalVisible.value = true
}

const closeNewTaskModal = () => {
  isNewTaskModalVisible.value = false
}

const submitTask = async () => {
  if (
    nuevaTarea.value.fechaEntrega === undefined ||
    nuevaTarea.value.fechaVerificacion === undefined ||
    nuevaTarea.value.descripcion === undefined ||
    nuevaTarea.value.descripcion === ''
  ) {
    alert('Por favor, complete todos los campos')
    return
  }
  const tareaResponse: ApiResponse<Tarea> = await asignarTareaNueva(nuevaTarea.value)
  if (tareaResponse.data) {
    console.log(tareaResponse.data)
    const data = tareaResponse.data as any
    tareasAsignadas.value.push({ ...tareaResponse.data, idTarea: data.idTareas as number })
  }
  closeNewTaskModal()
}

const GuardarAsignacion = async () => {
  const tareaSeleccionada = tasks.value.find((tarea) => tarea.idTarea === task.value.idTarea)
  if (tareaSeleccionada) {
    tareaSeleccionada.tipoResponsable = selectedParticipant.value.tipo
    await asignarTareaExistente(tareaSeleccionada)
    tareasAsignadas.value.push(tareaSeleccionada)
    tasks.value = tasks.value.filter((tarea) => tarea.idTarea !== task.value.idTarea)
    task.value = {} as Tarea
    // closeTaskModal()
  }
}

const assignTask = async (participante: Participante) => {
  console.log(participante)
  selectedParticipant.value = participante
  isTaskModalVisible.value = true
  const allTasks = (await getTareas()).data
  const assignedTasks = tareasAsignadas.value.map((tarea) => tarea.idTarea)
  tasks.value = allTasks.filter((tarea: Tarea) => !assignedTasks.includes(tarea.idTarea))
}

const EliminarAsignacion = (tarea: Tarea) => {
  tareasAsignadas.value = tareasAsignadas.value.filter((t) => t.idTarea !== tarea.idTarea)
  tasks.value.push(tarea)
}

const closeTaskModal = () => {
  isTaskModalVisible.value = false
  tasks.value = []
}
</script>

<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 100%;
}

.select,
.input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tareas-asignadas {
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  gap: 5px;
}

.tareas-child {
  max-width: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 1fr 30px;
}

.delete {
  color: red;
  font-weight: bold;
  cursor: pointer;
  height: fit-content;
}
</style>
