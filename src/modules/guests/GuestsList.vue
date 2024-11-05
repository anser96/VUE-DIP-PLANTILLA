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
          <label>Estado de Asistencia:</label>
          <input v-model="selectedGuest.estadoAsistencia" class="input" /> 
          <label>Correo Electrónico:</label>
          <input v-model="selectedGuest.email" class="input" />
          
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
          <p><strong>Estado de Asistencia:</strong> {{ selectedGuest.estadoAsistencia }}</p>
          <p><strong>Correo Electrónico:</strong> {{ selectedGuest.email }}</p>
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
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from 'vue-router';
  import ConfirmModal from '../../components/ConfirmModal.vue';
  import { Invitado, ApiResponse } from "../../Utils/Interfaces/MeetingRecords";
  import { getInvitados } from "../../services/invitadoServices";


  const guests = ref<Invitado[]>([]);
  const isModalVisible = ref(false);
  const isEditModalVisible = ref(false);
  const isTaskModalVisible = ref(false);
  const isViewModalVisible = ref(false);
  const guestIdToDelete = ref<number | null>(null);
  const selectedGuest = ref<any>(null);

  const task = ref({
    descripcion: "",
    fechaEntrega: "",
    fechaVerificacion: ""
  });

  const isChildRouteActive = computed(() =>
    useRoute().matched.some(
      (r) =>
        r.path.includes("/guests/create") || r.path.includes("/guests/edit")
    )
  );

  onMounted(async () => {
    try {
      const response: ApiResponse<Invitado[]> = await getInvitados();
      if (Array.isArray(response)) {
        guests.value = response;
      } else if ("data" in response && Array.isArray(response.data)) {
        guests.value = response.data;
      } else if ("results" in response && Array.isArray(response.results)) {
        guests.value = response.results;
      } else {
        console.error("Estructura inesperada de los datos de invitado:", response);
      }
    } catch (error) {
      console.error("Error al cargar los invitados:", error);
    }
  });

  // Funciones para el modal de confirmación
  const showConfirmModal = (id: number) => {
    guestIdToDelete.value = id;
    isModalVisible.value = true;
  };

  const confirmDelete = () => {
    if (guestIdToDelete.value !== null) {
      const index = guests.value.findIndex(
        (guest) => guest.idInvitado === guestIdToDelete.value
      );
      if (index !== -1) {
        guests.value.splice(index, 1);
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
    selectedGuest.value = { ...guest };
    isEditModalVisible.value = true;
  };

  const closeEditModal = () => {
    isEditModalVisible.value = false;
  };

  const saveGuest = () => {
    const index = guests.value.findIndex(
      (guest) => guest.idInvitado === selectedGuest.value.idMember
    );
    if (index !== -1) {
      guests.value[index] = selectedGuest.value;
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
    const taskToAdd = { ...task.value, id: Date.now() };
    selectedGuest.value.tasks.push(taskToAdd);
    closeTaskModal();
    task.value = { descripcion: '', fechaEntrega: '', fechaVerificacion: '' }; // Resetear el formulario
  };

  const viewGuests = (guest: Invitado) => {
    selectedGuest.value = guest;
    isViewModalVisible.value = true;
  };

  // Funciones para el modal de ver información
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