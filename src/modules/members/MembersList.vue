<template>
  <div class="p-4">
    <div v-if="!isChildRouteActive">
      <h1 class="text-3xl font-bold mb-4">Lista de Miembros</h1>

      <div class="flex justify-end mb-4">
        <router-link to="/members/create" class="btn btn-primary">
          Crear Nuevo Miembro
        </router-link>
      </div>

      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.idMiembro">
            <td>{{ member.idMiembro }}</td>
            <td>{{ member.nombre || "Sin nombre" }}</td>
            <td>{{ member.cargo || "Sin cargo" }}</td>
            <td>{{ member.email || "Sin email" }}</td>
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
        <input v-model="selectedMember.idMiembro" class="input" disabled /> <!-- Deshabilitado -->
        <label>Nombre:</label>
        <input v-model="selectedMember.nombre" class="input" />
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
          <button type="submit" class="btn btn-success mt-4">Guardar Tarea</button>
          <button @click="closeTaskModal" class="btn btn-secondary mt-4">Cerrar</button>
        </form>
      </div>
    </div>

    <!-- Modal para ver la información del miembro -->
    <div v-if="isViewModalVisible" class="modal-background">
      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">Información de {{ selectedMember.name }}</h2>
        <p><strong>ID:</strong> {{ selectedMember.idMiembro }}</p>
        <p><strong>Nombre:</strong> {{ selectedMember.nombre }}</p>
        <p><strong>Cargo:</strong> {{ selectedMember.cargo }}</p>
        <p><strong>Email:</strong> {{ selectedMember.email }}</p>

        <button @click="closeViewModal" class="btn btn-secondary mt-4">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import ConfirmModal from "../../components/ConfirmModal.vue";
import { Miembro, ApiResponse } from "../../Utils/Interfaces/MeetingRecords";
import { getMiembros } from "../../services/miembroService";

const members = ref<Miembro[]>([]);
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isTaskModalVisible = ref(false);
const isViewModalVisible = ref(false);
const memberIdToDelete = ref<number | null>(null);
const selectedMember = ref<any>(null);

const task = ref({
  descripcion: "",
  fechaEntrega: "",
  fechaVerificacion: ""
});

const isChildRouteActive = computed(() =>
  useRoute().matched.some(
    (r) =>
      r.path.includes("/members/create") || r.path.includes("/members/edit")
  )
);

onMounted(async () => {
  try {
    const response: ApiResponse<Miembro[]> = await getMiembros();
    if (Array.isArray(response)) {
      members.value = response;
    } else if ("data" in response && Array.isArray(response.data)) {
      members.value = response.data;
    } else if ("results" in response && Array.isArray(response.results)) {
      members.value = response.results;
    } else {
      console.error("Estructura inesperada de los datos de miembros:", response);
    }
  } catch (error) {
    console.error("Error al cargar los miembros:", error);
  }
});

const showConfirmModal = (id: number) => {
  memberIdToDelete.value = id;
  isModalVisible.value = true;
};

const confirmDelete = () => {
  if (memberIdToDelete.value !== null) {
    const index = members.value.findIndex(
      (member) => member.idMiembro === memberIdToDelete.value
    );
    if (index !== -1) {
      members.value.splice(index, 1);
    }
  }
  isModalVisible.value = false;
  memberIdToDelete.value = null;
};

const cancelDelete = () => {
  isModalVisible.value = false;
  memberIdToDelete.value = null;
};

const openEditModal = (member: any) => {
  selectedMember.value = { ...member }; // Crea una copia para evitar la mutación directa
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
};

const saveMember = () => {
  const index = members.value.findIndex(
    (member) => member.idMiembro === selectedMember.value.idMiembro
  );
  if (index !== -1) {
    // Copiar el miembro sin modificar el idMiembro
    const updatedMember = { ...selectedMember.value };
    delete updatedMember.idMiembro; // Elimina el ID antes de guardarlo
    members.value[index] = { ...updatedMember, idMiembro: selectedMember.value.idMiembro }; // Mantener el ID original
  }
  closeEditModal(); // Cerrar el modal después de guardar los cambios
};



// Funciones para el modal de tareas
const assignTask = (member: any) => {
  selectedMember.value = member;
  isTaskModalVisible.value = true;
};

const closeTaskModal = () => {
  isTaskModalVisible.value = false;
};

const submitTask = () => {
  const taskWithId = { id: Date.now(), ...task.value };
  selectedMember.value.tasks.push(taskWithId);
  task.value = { descripcion: "", fechaEntrega: "", fechaVerificacion: "" };
  closeTaskModal();
};

const viewMember = (member: Miembro) => {
  selectedMember.value = member;
  isViewModalVisible.value = true;
};

const closeViewModal = () => {
  isViewModalVisible.value = false;
};
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

.input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
