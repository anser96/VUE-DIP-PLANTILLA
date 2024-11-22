<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Miembros</h1>

      <div class="flex justify-end mb-4">
        <router-link to="/members/create" class="btn btn-primary"> Crear Nuevo Miembro </router-link>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Cargo</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.idMiembro">
            <td>{{ member.idMiembro }}</td>
            <td>{{ member.nombre || 'Sin nombre' }}</td>
            <td>{{ member.numCedula || 'Sin cedula' }}</td>
            <td>{{ member.cargo || 'Sin cargo' }}</td>
            <td>{{ member.email || 'Sin email' }}</td>
            <td class="flex gap-2">
              <button @click="viewMember(member)" class="btn btn-info btn-sm">Ver</button>
              <button @click="openEditModal(member)" class="btn btn-warning btn-sm">Editar</button>
              <button @click="showConfirmModal(member.idMiembro)" class="btn btn-error btn-sm">Eliminar</button>
              <button @click="assignTask(member)" class="btn btn-success btn-sm">Asignar Tarea</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ConfirmModal :show="isModalVisible" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <router-view v-else />

    <!-- Modal de edición miembro-->
    <div v-if="isEditModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Editar Miembro</h2>
        <label>ID:</label>
        <input v-model="selectedMember.idMiembro" class="input" disabled />
        <!-- Deshabilitado -->
        <label>Nombre:</label>
        <input v-model="selectedMember.nombre" class="input" />
        <label>Cedula:</label>
        <input v-model="selectedMember.numCedula" class="input" />
        <label>Cargo:</label>
        <input v-model="selectedMember.cargo" class="input" />
        <label>Email:</label>
        <input v-model="selectedMember.email" class="input" />

        <button @click="closeEditModal" class="btn btn-secondary mt-4">Cerrar</button>
        <button @click="saveMember" class="btn btn-success mt-4">Guardar Cambios</button>
      </div>
    </div>

    <!-- Modal para asignar tarea -->
    <div v-if="isTaskModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Asignar Tarea a {{ selectedMember.nombre }}</h2>
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
          @click="openNewTaskModal(selectedMember.idMiembro)"
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

        <button @click="GuardarAsignacion(selectedMember.idMiembro)" class="btn btn-success mt-4">Guardar Tarea</button>
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

    <!-- Modal para ver la información del miembro -->
    <div v-if="isViewModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Información de {{ selectedMember.nombre }}</h2>
        <p><strong>ID:</strong> {{ selectedMember.idMiembro }}</p>
        <p><strong>Nombre:</strong> {{ selectedMember.nombre }}</p>
        <p><strong>Cedula:</strong> {{ selectedMember.numMiembroCedula }}</p>
        <p><strong>Cargo:</strong> {{ selectedMember.cargo }}</p>
        <p><strong>Email:</strong> {{ selectedMember.email }}</p>

        <button @click="closeViewModal" class="btn btn-secondary mt-4">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmModal from '../../components/ConfirmModal.vue'
import { deleteMiembro, getMiembros } from '../../services/miembroService'
import { asignarTareaExistente, asignarTareaNueva, getTareas, getTareasAsignadas } from '../../services/tareaServices'
import { ApiResponse, Miembro, Tarea } from '../../Utils/Interfaces/MeetingRecords'

const members = ref<Miembro[]>([])
const tasks = ref<Tarea[]>([])
const tareasAsignadas = ref<Tarea[]>([])
const isModalVisible = ref(false)
const isEditModalVisible = ref(false)
const isNewTaskModalVisible = ref(false)
const isTaskModalVisible = ref(false)
const isViewModalVisible = ref(false)
const memberIdToDelete = ref<number | null>(null)
const selectedMember = ref<any>(null)
const nuevaTarea = ref<Tarea>({
  tipoResponsable: 'miembro',
} as Tarea)
const task = ref<Tarea>({
  idTarea: 0,
} as Tarea)

const route = useRoute()
const isChildRouteActive = computed(() =>
  route.matched.some((r) => r.path.includes('/members/create') || r.path.includes('/members/edit')),
)

const LoadMembers = async () => {
  try {
    const response: ApiResponse<Miembro[]> = await getMiembros()
    if (Array.isArray(response)) {
      members.value = response
    } else if ('data' in response && Array.isArray(response.data)) {
      members.value = response.data
    } else if ('results' in response && Array.isArray(response.results)) {
      members.value = response.results
    } else {
      console.error('Estructura inesperada de los datos de miembros:', response)
    }
  } catch (error) {
    console.error('Error al cargar los miembros:', error)
  }
}

onMounted(LoadMembers)
watch(route, LoadMembers)

const showConfirmModal = (id: number) => {
  memberIdToDelete.value = id
  isModalVisible.value = true
}

const confirmDelete = async () => {
  if (memberIdToDelete.value !== null) {
    const responseDelet = await deleteMiembro(memberIdToDelete.value)
    if (!responseDelet.data) return
    const index = members.value.findIndex((member) => member.idMiembro === memberIdToDelete.value)
    if (index !== -1) {
      members.value.splice(index, 1)
    }
  }
  isModalVisible.value = false
  memberIdToDelete.value = null
}

const cancelDelete = () => {
  isModalVisible.value = false
  memberIdToDelete.value = null
}

const openEditModal = (member: any) => {
  selectedMember.value = { ...member } // Crea una copia para evitar la mutación directa
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

const saveMember = () => {
  const index = members.value.findIndex((member) => member.idMiembro === selectedMember.value.idMiembro)
  if (index !== -1) {
    // Copiar el miembro sin modificar el idMiembro
    const updatedMember = { ...selectedMember.value }
    delete updatedMember.idMiembro // Elimina el ID antes de guardarlo
    members.value[index] = { ...updatedMember, idMiembro: selectedMember.value.idMiembro } // Mantener el ID original
  }
  closeEditModal() // Cerrar el modal después de guardar los cambios
}

// Funciones para el modal de tareas
const assignTask = async (member: any) => {
  selectedMember.value = member
  isTaskModalVisible.value = true
  const responseAsignadas = (await getTareasAsignadas('miembro', member.idMiembro)).data as Tarea[]
  const allTasks = (await getTareas()).data

  tareasAsignadas.value = responseAsignadas
  const assignedTasks = tareasAsignadas.value.map((tarea) => tarea.idTarea)
  tasks.value = allTasks.filter((tarea: Tarea) => !assignedTasks.includes(tarea.idTarea))
}

const GuardarAsignacion = async (id: number) => {
  const tareaSeleccionada = tasks.value.find((tarea) => tarea.idTarea === task.value.idTarea)
  if (tareaSeleccionada) {
    tareaSeleccionada.tipoResponsable = 'miembro'
    tareaSeleccionada.responsableId = id
    await asignarTareaExistente(tareaSeleccionada)
    tareasAsignadas.value.push(tareaSeleccionada)
    tasks.value = tasks.value.filter((tarea) => tarea.idTarea !== task.value.idTarea)
    task.value = {} as Tarea
    // closeTaskModal()
  }
}

const EliminarAsignacion = async (tarea: Tarea) => {
  tareasAsignadas.value = tareasAsignadas.value.filter((t) => t.idTarea !== tarea.idTarea)
  tarea.tipoResponsable = ''
  tarea.responsableId = 0
  tarea.responsable = null
  await asignarTareaExistente(tarea)
  tasks.value.push(tarea)
}

const closeTaskModal = () => {
  isTaskModalVisible.value = false
  tasks.value = []
  tareasAsignadas.value = []
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

const viewMember = (member: Miembro) => {
  selectedMember.value = member
  isViewModalVisible.value = true
}

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
