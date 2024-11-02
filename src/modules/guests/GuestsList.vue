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
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in guests" :key="guest.idGuest">
            <td>{{ guest.idGuest }}</td>
            <td>{{ guest.name }}</td>
            <td>{{ guest.dependency }}</td>
            <td>{{ guest.role }}</td>
            <td class="flex gap-2">
              <button @click="openViewModal(guest)" class="btn btn-info btn-sm">Ver</button>
              <button @click="openEditModal(guest)" class="btn btn-warning btn-sm">Editar</button>
              <button @click="showConfirmModal(guest.idGuest)" class="btn btn-error btn-sm">Eliminar</button>
              <button @click="assignTask(guest)" class="btn btn-success btn-sm">Asignar Tarea</button>
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

    <!-- Modal de Editar Invitado -->
    <div v-if="isEditModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Editar Invitado</h2>
        <p><strong>ID:</strong> {{ selectedGuest.idGuest }}</p>
        <label>Nombre:</label>
        <input v-model="selectedGuest.name" class="input" />
        <label>Dependencia:</label>
        <input v-model="selectedGuest.dependency" class="input" />
        <label>Cargo:</label>
        <input v-model="selectedGuest.role" class="input" />

        <h3 class="mt-4">Tareas Asignadas</h3>
        <ul>
          <li v-for="task in selectedGuest.tasks" :key="task.id">
            {{ task.descripcion }} - Fecha de Entrega: {{ task.fechaEntrega }} - Fecha de Verificación: {{ task.fechaVerificacion }}
          </li>
        </ul>

        <button @click="closeEditModal" class="btn btn-secondary mt-4">Cerrar</button>
        <button @click="saveGuest" class="btn btn-success mt-4">Guardar Cambios</button>
      </div>
    </div>

    <!-- Modal de Asignar Tarea -->
    <div v-if="isTaskModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Asignar Tarea a {{ selectedGuest.name }}</h2>
        <form @submit.prevent="submitTask">
          <div class="mb-2">
            <label>Descripción de Tarea:</label>
            <input type="text" v-model="task.descripcion" required class="input"/>
          </div>
          <div class="mb-2">
            <label>Fecha de Entrega:</label>
            <input type="date" v-model="task.fechaEntrega" required class="input"/>
          </div>
          <div class="mb-2">
            <label>Fecha de Verificación:</label>
            <input type="date" v-model="task.fechaVerificacion" required class="input"/>
          </div>
          <div class="mb-2">
            <label>Tipo de Responsable:</label>
            <select v-model="task.tipoResponsable" class="input" required>
              <option disabled value="">Seleccione...</option>
              <option value="Miembro">Miembro</option>
              <option value="Invitado">Invitado</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success mt-4">Guardar Tarea</button>
          <button @click="closeTaskModal" class="btn btn-secondary mt-4">Cerrar</button>
        </form>
      </div>
    </div>

    <!-- Modal de Ver Información del Invitado -->
    <div v-if="isViewModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Información de {{ selectedGuest.name }}</h2>
        <p><strong>ID:</strong> {{ selectedGuest.idGuest }}</p>
        <p><strong>Dependencia:</strong> {{ selectedGuest.dependency }}</p>
        <p><strong>Cargo:</strong> {{ selectedGuest.role }}</p>

        <h3 class="mt-4">Tareas Asignadas</h3>
        <ul>
          <li v-for="task in selectedGuest.tasks" :key="task.id">
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

// Lista de invitados almacenados localmente (simulación)
const guests = ref([
  { idGuest: 1, name: 'Carlos Martínez', dependency: 'Departamento de Física', role: 'Investigador', tasks: [] },
  { idGuest: 2, name: 'Ana Gómez', dependency: 'Departamento de Biología', role: 'Jefe de Proyecto', tasks: [] }
]);

const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isTaskModalVisible = ref(false);
const isViewModalVisible = ref(false); // Agregado
const guestIdToDelete = ref<number | null>(null);
const selectedGuest = ref<any>(null);

const task = ref({
  descripcion: '',
  fechaEntrega: '',
  fechaVerificacion: '',
  tipoResponsable: '', // Nueva propiedad para almacenar el tipo de responsable
});

const route = useRoute();
const isChildRouteActive = computed(() => {
  return route.matched.some(r => r.path.includes('/guests/create') || r.path.includes('/guests/edit'));
});

// Funciones para el modal de confirmación
const showConfirmModal = (id: number) => {
  guestIdToDelete.value = id;
  isModalVisible.value = true;
};

const confirmDelete = () => {
  if (guestIdToDelete.value !== null) {
    const index = guests.value.findIndex(guest => guest.idGuest === guestIdToDelete.value);
    if (index !== -1) {
      guests.value.splice(index, 1); // Eliminar invitado de la lista
    }
  }
  isModalVisible.value = false;
  guestIdToDelete.value = null;
};

const cancelDelete = () => {
  isModalVisible.value = false;
  guestIdToDelete.value = null;
};

// Funciones para el modal de edición
const openEditModal = (guest: any) => {
  selectedGuest.value = { ...guest }; // Crear una copia del invitado
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
};

const saveGuest = () => {
  const index = guests.value.findIndex(guest => guest.idGuest === selectedGuest.value.idGuest);
  if (index !== -1) {
    guests.value[index] = selectedGuest.value; // Actualizar el invitado
  }
  closeEditModal();
};

// Funciones para el modal de tareas
const assignTask = (guest: any) => {
  selectedGuest.value = guest;
  isTaskModalVisible.value = true;
};

const closeTaskModal = () => {
  isTaskModalVisible.value = false;
};

const submitTask = () => {
  const taskWithId = { id: Date.now(), ...task.value }; // Generar un ID único para la tarea
  selectedGuest.value.tasks.push(taskWithId); // Agregar tarea al invitado
  console.log("Tarea asignada a:", selectedGuest.value.name, "con datos:", task.value);
  task.value = { descripcion: '', fechaEntrega: '', fechaVerificacion: '', tipoResponsable: '' }; // Limpiar los campos
  closeTaskModal();
};

// Funciones para el modal de vista
const openViewModal = (guest: any) => {
  selectedGuest.value = guest; // Seleccionar el invitado para ver
  isViewModalVisible.value = true;
};

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
