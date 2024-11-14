<template>
  <div class="p-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Lista de Tareas Asignadas</h1>

      <div class="flex justify-end mb-4">
        <button @click="assignTask()" class="btn btn-primary">Asignar Tarea</button>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha de Entrega</th>
            <th>Fecha de Verificación</th>
            <th>Tipo de Responsable</th>
            <th>ID del Responsable</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tareasAsignadas" :key="task.idTarea">
            <td>{{ task.idTarea }}</td>
            <td>{{ task.descripcion }}</td>
            <td>{{ formatDate(task.fechaEntrega) }}</td>
            <td>{{ formatDate(task.fechaVerificacion) }}</td>
            <td>{{ task.tipoResponsable }}</td>
            <td>{{ task.responsableId }}</td>
            <td>{{ task.estado }}</td>
            <td class="flex gap-2">
              <button @click="viewTask(task)" class="btn btn-info btn-sm">Ver</button>
              <button @click="openEditModal(task)" class="btn btn-warning btn-sm">Editar</button>
              <button @click="showConfirmModal(task.idTarea)" class="btn btn-error btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Confirmación Eliminar -->
      <ConfirmModal :show="isModalVisible" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <!-- Modal de Edición de Tarea -->
    <div v-if="isEditModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>
        <label>IdTarea:</label>
        <input v-model="selectedTask.idTarea" class="input" disabled />
        <label>Descripción:</label>
        <input v-model="selectedTask.descripcion" class="input" />
        <label>Fecha de Entrega:</label>
        <input v-model="selectedTask.fechaEntrega" class="input" type="date" />
        <label>Fecha de Verificación:</label>
        <input v-model="selectedTask.fechaVerificacion" class="input" type="date" />

        <label>Tipo Responsable:</label>
        <select v-model="selectedTask.tipoResponsable" class="select" @change="fetchResponsables">
          <option value="miembro">Miembro</option>
          <option value="invitado">Invitado</option>
        </select>

        <label>ResponsableId:</label>
        <select v-model="selectedTask.responsableId" class="select">
          <option v-if="responsableOpciones.length === 0" disabled>No hay miembros o invitados para asignar</option>
          <option v-for="responsable in responsableOpciones" :key="responsable.id" :value="responsable.id">
            {{ responsable.nombre }}
          </option>
        </select>
        <label>Estado:</label>
        <input v-model="selectedTask.estado" class="input" />

        <div class="flex justify-between gap-2 mt-4">
          <button @click="closeEditModal" class="btn btn-secondary">Cerrar</button>
          <button @click="saveTask" class="btn btn-success">Guardar Cambios</button>
        </div>
      </div>
    </div>

    <!-- Modal para asignar tarea -->
    <div v-if="isTaskModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Asignar Tarea</h2>

        <label>Tareas:</label>
        <select v-model="currentTask.idTarea" class="select">
          <option v-if="tasks.length === 0" disabled>No hay tareas por asignar</option>
          <option v-for="tarea in tasks" :key="tarea.idTarea" :value="tarea.idTarea">
            {{ tarea.descripcion }}
          </option>
        </select>

        <label>Tipo Responsable:</label>
        <select v-model="currentTask.tipoResponsable" class="select" @change="fetchResponsables">
          <option value="miembro">Miembro</option>
          <option value="invitado">Invitado</option>
        </select>

        <label>ResponsableId:</label>
        <select v-model="currentTask.responsableId" class="select">
          <option v-if="responsableOpciones.length === 0" disabled>No hay miembros o invitados para asignar</option>
          <option v-for="responsable in responsableOpciones" :key="responsable.id" :value="responsable.id">
            {{ responsable.nombre }}
          </option>
        </select>

        <button @click="GuardarAsignacion" class="btn btn-success mt-4">Guardar Tarea</button>
        <button @click="closeTaskModal" class="btn btn-secondary mt-4">Cerrar</button>
      </div>
    </div>

    <!-- Modal de Ver Tarea -->
    <div v-if="isViewModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Información de la Tarea</h2>
        <p><strong>IdTarea:</strong> {{ selectedTask.idTarea }}</p>
        <p><strong>Descripción:</strong> {{ selectedTask.descripcion }}</p>
        <p><strong>Fecha de Entrega:</strong> {{ formatDate(selectedTask.fechaEntrega) }}</p>
        <p><strong>Fecha de Verificación:</strong> {{ formatDate(selectedTask.fechaVerificacion) }}</p>
        <p><strong>Tipo Responsable:</strong> {{ selectedTask.tipoResponsable }}</p>
        <p><strong>ResponsableId:</strong> {{ selectedTask.responsableId }}</p>
        <p><strong>Estado:</strong> {{ selectedTask.estado }}</p>

        <div class="mt-4">
          <button @click="closeViewModal" class="btn btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import { getInvitados } from '../../services/invitadoServices'
import { getMiembros } from '../../services/miembroService'
import { asignarTareaExistente, getTareas, getTareasAsignadas } from '../../services/tareaServices'
import { ApiResponse, Invitado, Miembro, Responsable, Tarea } from '../../Utils/Interfaces/MeetingRecords'

const tasks = ref<Tarea[]>([])
const tareasAsignadas = ref<Tarea[]>([])
const isModalVisible = ref(false)
const isEditModalVisible = ref(false)
const isViewModalVisible = ref(false)
const taskIdToDelete = ref<number | null>(null)
const selectedTask = ref<any>(null)
const isTaskModalVisible = ref(false)
const responsableOpciones = ref<Responsable[]>([])
const currentTask = ref<Tarea>({} as Tarea)
const reloadTareasAsignadas = ref<boolean>(false)

// const isChildRouteActive = computed(() =>
//   useRoute().matched.some((r) => r.path.includes('/tasks/create') || r.path.includes('/tasks/edit')),
// )

const loadTareasAsignadas = async () => {
  try {
    const response: ApiResponse<Tarea[]> = await getTareasAsignadas()
    console.log(response)
    if (Array.isArray(response.data)) {
      tareasAsignadas.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar las tareas:', error)
  }
}

onMounted(loadTareasAsignadas)
watch(
  () => reloadTareasAsignadas.value,
  () => {
    loadTareasAsignadas()
  },
)

const showConfirmModal = (id: number) => {
  taskIdToDelete.value = id
  isModalVisible.value = true
}

// Confirmar y eliminar tarea
const confirmDelete = () => {
  EliminarAsignacion({ idTarea: taskIdToDelete.value } as Tarea)
  isModalVisible.value = false
  taskIdToDelete.value = null
}

// Funciones para el modal de tareas
const assignTask = async () => {
  tasks.value = (await getTareas()).data
  isTaskModalVisible.value = true
}

const GuardarAsignacion = async () => {
  const tareaSeleccionada = tasks.value.find((tarea) => tarea.idTarea === currentTask.value.idTarea)
  if (tareaSeleccionada) {
    tareaSeleccionada.tipoResponsable = currentTask.value.tipoResponsable
    tareaSeleccionada.responsableId = currentTask.value.responsableId
    await asignarTareaExistente(tareaSeleccionada)
    currentTask.value = {} as Tarea
    closeTaskModal()
  }
}

const EliminarAsignacion = (tarea: Tarea) => {
  tareasAsignadas.value = tareasAsignadas.value.filter((t) => t.idTarea !== tarea.idTarea)
}

const closeTaskModal = () => {
  isTaskModalVisible.value = false
  reloadTareasAsignadas.value = !reloadTareasAsignadas.value
  tasks.value = []
}

const fetchResponsables = async (event: any) => {
  try {
    let responseMiembros: ApiResponse<Miembro[]> = {} as ApiResponse<Miembro[]>
    let responseInvitado: ApiResponse<Invitado[]> = {} as ApiResponse<Invitado[]>
    console.log('Tipo seleccionado:', event.target.value)
    if (event.target.value === 'miembro') {
      responseMiembros = await getMiembros()
      responsableOpciones.value = responseMiembros.data.map(
        (r) => ({ id: r.idMiembro, nombre: r.nombre } as Responsable),
      )
    } else if (event.target.value === 'invitado') {
      console.log('llego')
      responseInvitado = await getInvitados()
      responsableOpciones.value = responseInvitado.data.map(
        (r) => ({ id: r.idInvitado, nombre: r.nombre } as Responsable),
      )
    }
  } catch (error) {
    console.error('Error al obtener los responsables:', error)
  }
}

const cancelDelete = () => {
  isModalVisible.value = false
  taskIdToDelete.value = null
}

const openEditModal = (task: any) => {
  selectedTask.value = { ...task }
  isEditModalVisible.value = true
}

const closeEditModal = () => {
  isEditModalVisible.value = false
}

const saveTask = () => {
  const index = tareasAsignadas.value.findIndex((task) => task.idTarea === selectedTask.value.idTarea)
  if (index !== -1) {
    tareasAsignadas.value[index] = { ...selectedTask.value }
  }
  closeEditModal()
}

const viewTask = (task: Tarea) => {
  selectedTask.value = task
  isViewModalVisible.value = true
}

const closeViewModal = () => {
  isViewModalVisible.value = false
}

// Formato de fecha
const formatDate = (date: string) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const
  return new Date(date).toLocaleDateString('es-ES', options)
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
</style>
