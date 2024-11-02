<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Miembros</h1>

      <div class="flex justify-end mb-4">
        <router-link to="/members/create" class="btn btn-primary">Crear Nuevo Miembro</router-link>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.idMember">
            <td>{{ member.idMember }}</td>
            <td>{{ member.name }}</td>
            <td>{{ member.role }}</td>
            <td class="flex gap-2">
              <button @click="viewMember(member)" class="btn btn-info btn-sm">Ver</button>
              <button @click="openEditModal(member)" class="btn btn-warning btn-sm">Editar</button>
              <button @click="showConfirmModal(member.idMember)" class="btn btn-error btn-sm">Eliminar</button>
              <button @click="assignTask(member)" class="btn btn-success btn-sm">Asignar Tarea</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ConfirmModal 
        :show="isModalVisible"  
        @confirm="confirmDelete" 
        @cancel="cancelDelete" 
      />
    </div>

    <router-view v-else />

    <!-- Modal de edición -->
    <div v-if="isEditModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Editar Miembro</h2>
        <p><strong>ID:</strong> {{ selectedMember.idMember }}</p>
        <label>Nombre:</label>
        <input v-model="selectedMember.name" class="input" />
        <label>Cargo:</label>
        <input v-model="selectedMember.role" class="input" />

        <h3 class="mt-4">Tareas Asignadas</h3>
        <ul>
          <li v-for="task in selectedMember.tasks" :key="task.id">
            {{ task.descripcion }} - Fecha de Entrega: {{ task.fechaEntrega }} - Fecha de Verificación: {{ task.fechaVerificacion }}
          </li>
        </ul>

        <button @click="closeEditModal" class="btn btn-secondary mt-4">Cerrar</button>
        <button @click="saveMember" class="btn btn-success mt-4">Guardar Cambios</button>
      </div>
    </div>

    <!-- Modal para asignar tarea -->
    <div v-if="isTaskModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Asignar Tarea a {{ selectedMember.name }}</h2>
        <form @submit.prevent="submitTask">
          <div class="mb-2">
            <label>Descripción de Tarea:</label>
            <input type="text" v-model="task.descripcion" required class="input" />
          </div>
          <div class="mb-2">
            <label>Fecha de Entrega:</label>
            <input type="date" v-model="task.fechaEntrega" required class="input" />
          </div>
          <div class="mb-2">
            <label>Fecha de Verificación:</label>
            <input type="date" v-model="task.fechaVerificacion" required class="input" />
          </div>
          <div class="mb-2">
            <label>Tipo de Responsable:</label>
            <select v-model="task.tipoResponsable" required class="input">
              <option value="">Seleccione...</option>
              <option value="miembro">Miembro</option>
              <option value="invitado">Invitado</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success mt-4">Guardar Tarea</button>
          <button @click="closeTaskModal" class="btn btn-secondary mt-4">Cerrar</button>
        </form>
      </div>
    </div>

    <!-- Modal para ver la información del miembro -->
    <div v-if="isViewModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Información de {{ selectedMember.name }}</h2>
        <p><strong>ID:</strong> {{ selectedMember.idMember }}</p>
        <p><strong>Nombre:</strong> {{ selectedMember.name }}</p>
        <p><strong>Cargo:</strong> {{ selectedMember.role }}</p>
        <h3 class="mt-4">Tareas Asignadas</h3>
        <ul>
          <li v-for="task in selectedMember.tasks" :key="task.id">
            {{ task.descripcion }} - Fecha de Entrega: {{ task.fechaEntrega }} - Fecha de Verificación: {{ task.fechaVerificacion }}
          </li>
        </ul>
        <button @click="closeViewModal" class="btn btn-secondary mt-4">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../../components/ConfirmModal.vue';

// Lista de miembros almacenados localmente (simulación)
const members = ref([
  { idMember: 1, name: 'Juan Pérez', role: 'Presidente', tasks: [] },
  { idMember: 2, name: 'María López', role: 'Secretario', tasks: [] }
]);

const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isTaskModalVisible = ref(false);
const isViewModalVisible = ref(false);
const memberIdToDelete = ref<number | null>(null);
const selectedMember = ref<any>(null);

const task = ref({
  descripcion: '',
  fechaEntrega: '',
  fechaVerificacion: '',
  tipoResponsable: '', // Nueva propiedad para almacenar el tipo de responsable
});

const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/members/create') || r.path.includes('/members/edit'));
});

// Función para mostrar el modal de confirmación
const showConfirmModal = (id: number) => {
  memberIdToDelete.value = id;
  isModalVisible.value = true;
};

// Confirmar eliminación
const confirmDelete = () => {
  if (memberIdToDelete.value !== null) {
    const index = members.value.findIndex(member => member.idMember === memberIdToDelete.value);
    if (index !== -1) {
      members.value.splice(index, 1); // Eliminar miembro de la lista
    }
  }
  isModalVisible.value = false;
  memberIdToDelete.value = null;
};

// Cancelar eliminación
const cancelDelete = () => {
  isModalVisible.value = false;
  memberIdToDelete.value = null;
};

// Abrir el modal de edición
const openEditModal = (member: any) => {
  selectedMember.value = { ...member }; // Crear una copia del miembro
  isEditModalVisible.value = true;
};

// Cerrar el modal de edición
const closeEditModal = () => {
  isEditModalVisible.value = false;
};

// Guardar cambios del miembro
const saveMember = () => {
  const index = members.value.findIndex(member => member.idMember === selectedMember.value.idMember);
  if (index !== -1) {
    members.value[index] = selectedMember.value; // Actualizar el miembro
  }
  closeEditModal();
};

// Asignar tarea
const assignTask = (member: any) => {
  selectedMember.value = member;
  isTaskModalVisible.value = true;
};

// Cerrar el modal de tarea
const closeTaskModal = () => {
  isTaskModalVisible.value = false;
};

// Enviar tarea
const submitTask = () => {
  const taskWithId = { id: Date.now(), ...task.value }; // Generar un ID único para la tarea
  selectedMember.value.tasks.push(taskWithId); // Agregar tarea al miembro
  console.log("Tarea asignada a:", selectedMember.value.name, "con datos:", task.value);
  task.value = { descripcion: '', fechaEntrega: '', fechaVerificacion: '', tipoResponsable: '' }; // Limpiar los campos
  closeTaskModal();
};

// Mostrar información del miembro
const viewMember = (member: any) => {
  selectedMember.value = { ...member }; // Crear una copia del miembro
  isViewModalVisible.value = true; // Abrir el modal de vista
};

// Cerrar el modal de vista
const closeViewModal = () => {
  isViewModalVisible.value = false;
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.input {
  margin-top: 5px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  margin-top: 10px;
}
</style>
