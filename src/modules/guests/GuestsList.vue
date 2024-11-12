<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Invitados</h1>

      <div class="flex justify-end mb-4">
        <router-link to="/guests/create" class="btn btn-primary">Crear Nuevo Invitado</router-link>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dependencia</th>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in guests" :key="guest.idInvitado">
            <td>{{ guest.idInvitado }}</td>
            <td>{{ guest.nombre }}</td>
            <td>{{ guest.dependencia }}</td>
            <td>{{ guest.email }}</td>
            <td class="flex gap-2">
              <button @click="viewGuests(guest)" class="btn btn-info btn-sm">Ver</button>
              <button @click="openEditModal(guest)" class="btn btn-warning btn-sm">Editar</button>
              <button @click="showConfirmModal(guest.idInvitado)" class="btn btn-error btn-sm">Eliminar</button>
              <button @click="assignTask(guest)" class="btn btn-success btn-sm">Asignar Tarea</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ConfirmModal :show="isModalVisible" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <router-view v-else />

    <!-- Modal de Editar Invitado -->
    <div v-if="isEditModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Editar Invitado</h2>

        <!-- ID deshabilitado para que no se pueda editar -->
        <label>ID:</label>
        <input v-model="selectedGuest.idInvitado" class="input" disabled />
        <label>Nombre:</label>
        <input v-model="selectedGuest.nombre" class="input" />
        <label>Dependencia:</label>
        <input v-model="selectedGuest.dependencia" class="input" />
        <label>Correo Electrónico:</label>
        <input v-model="selectedGuest.email" class="input" />
        <button @click="closeEditModal" class="btn btn-secondary mt-4">Cerrar</button>
        <button @click="saveGuest" class="btn btn-success mt-4">Guardar Cambios</button>
      </div>
    </div>

    <<!-- Modal para asignar tarea -->
    <div v-if="isTaskModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Asignar Tarea a {{ selectedGuest.nombre }}</h2>
        <label>Tareas Existentes:</label>
        <select v-model="task.idTarea" class="select">
          <option v-if="tasks.length === 0" disabled>No hay tareas por asignar</option>
          <option v-for="tarea in tasks" :key="tarea.idTarea" :value="tarea.idTarea">
            {{ tarea.descripcion }}
          </option>
        </select>

        <p class="text-xs my-2">*Si lo prefiere puede crear una nueva tarea para asignar*</p>
        <button
          class="btn btn-info mt-2 mb-4 btn-sm"
          style="display: block"
          @click="openNewTaskModal(selectedGuest.idInvitado)"
        >
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

        <button @click="GuardarAsignacion" class="btn btn-success mt-4">Guardar Tarea</button>
        <button @click="closeTaskModal" class="btn btn-secondary mt-4">Cerrar</button>
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
          <button @click="closeNewTaskModal" class="btn btn-secondary">Cerrar</button>
          <button @click="submitTask" class="btn btn-success">Guardar Cambios</button>
        </div>
      </div>
    </div>

    <!-- Modal de Ver Información del Invitado -->
    <div v-if="isViewModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Información de {{ selectedGuest.name }}</h2>
        <p><strong>ID:</strong> {{ selectedGuest.idInvitado }}</p>
        <p><strong>Nombre:</strong> {{ selectedGuest.nombre }}</p>
        <p><strong>Dependencia:</strong> {{ selectedGuest.dependencia }}</p>
        <p><strong>Correo Electrónico:</strong> {{ selectedGuest.email }}</p>

        <button @click="closeViewModal" class="btn btn-secondary mt-4">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmModal from '../../components/ConfirmModal.vue'
import { getInvitados } from '../../services/invitadoServices'
import { asignarTareaExistente, asignarTareaNueva, getTareas } from '../../services/tareaServices'
import { ApiResponse, Invitado, Tarea } from '../../Utils/Interfaces/MeetingRecords'

const guests = ref<Invitado[]>([])
const tasks = ref<Tarea[]>([])
const tareasAsignadas = ref<Tarea[]>([])
const isModalVisible = ref(false)
const isEditModalVisible = ref(false)
const isTaskModalVisible = ref(false)
const isNewTaskModalVisible = ref(false)
const isViewModalVisible = ref(false)
const guestIdToDelete = ref<number | null>(null)
const selectedGuest = ref<any>(null)
const nuevaTarea = ref<Tarea>({
  tipoResponsable: 'Invitado',
} as Tarea)

const task = ref({
  idTarea: 0,
})

const route = useRoute()
const isChildRouteActive = computed(() =>
  route.matched.some((r) => r.path.includes('/guests/create') || r.path.includes('/guests/edit')),
)

const LoadGuests = async () => {
  try {
    const response: ApiResponse<Invitado[]> = await getInvitados()
    if (Array.isArray(response)) {
      guests.value = response
    } else if ('data' in response && Array.isArray(response.data)) {
      guests.value = response.data
    } else if ('results' in response && Array.isArray(response.results)) {
      guests.value = response.results
    } else {
      console.error('Estructura inesperada de los datos de invitado:', response)
    }
  } catch (error) {
    console.error('Error al cargar los invitados:', error)
  }
}

onMounted(LoadGuests)
watch(route, LoadGuests)

// Funciones para el modal de confirmación
const showConfirmModal = (id: number) => {
  guestIdToDelete.value = id
  isModalVisible.value = true
}

const confirmDelete = () => {
  if (guestIdToDelete.value !== null) {
    const index = guests.value.findIndex((guest) => guest.idInvitado === guestIdToDelete.value)
    if (index !== -1) {
      guests.value.splice(index, 1)
    }
  }
  isModalVisible.value = false
  guestIdToDelete.value = null
}

const cancelDelete = () => {
  isModalVisible.value = false
  guestIdToDelete.value = null
}

// Funciones para el modal de edición
const openEditModal = (guest: any) => {
  selectedGuest.value = { ...guest }
  isEditModalVisible.value = true
}

const openNewTaskModal = (idResponsable: number) => {
  nuevaTarea.value = { ...nuevaTarea.value, responsableId: idResponsable }
  isNewTaskModalVisible.value = true
}

const closeNewTaskModal = () => {
  isNewTaskModalVisible.value = false
}

const closeEditModal = () => {
  isEditModalVisible.value = false
}

const saveGuest = () => {
  const index = guests.value.findIndex((guest) => guest.idInvitado === selectedGuest.value.idInvitado)
  if (index !== -1) {
    // Actualizamos el invitado en la lista
    guests.value[index] = selectedGuest.value
  }
  closeEditModal() // Cerramos el modal después de guardar los cambios
}

// Funciones para el modal de tareas
const assignTask = async (member: any) => {
  selectedGuest.value = member
  isTaskModalVisible.value = true
  const allTasks = (await getTareas()).data
  const assignedTasks = tareasAsignadas.value.map((tarea) => tarea.idTarea)
  tasks.value = allTasks.filter((tarea: Tarea) => !assignedTasks.includes(tarea.idTarea))
}

const GuardarAsignacion = async () => {
  const tareaSeleccionada = tasks.value.find((tarea) => tarea.idTarea === task.value.idTarea)
  if (tareaSeleccionada) {
    tareaSeleccionada.tipoResponsable = 'Invitado'
    await asignarTareaExistente(tareaSeleccionada)
    tareasAsignadas.value.push(tareaSeleccionada)
    tasks.value = tasks.value.filter((tarea) => tarea.idTarea !== task.value.idTarea)
    task.value = { idTarea: 0 }
    // closeTaskModal()
  }
}

const EliminarAsignacion = (tarea: Tarea) => {
  tareasAsignadas.value = tareasAsignadas.value.filter((t) => t.idTarea !== tarea.idTarea)
  tasks.value.push(tarea)
}

const closeTaskModal = () => {
  isTaskModalVisible.value = false
  tasks.value = []
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

const viewGuests = (guest: Invitado) => {
  selectedGuest.value = guest
  isViewModalVisible.value = true
}

// Funciones para el modal de ver información
const closeViewModal = () => {
  isViewModalVisible.value = false
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
