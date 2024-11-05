<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg">
      <h3 class="text-lg font-bold">Agregar Invitado</h3>
      <form @submit.prevent="submitGuest">
        <!-- Selección de Invitado Existente -->
        <div class="mb-4">
          <label for="select-guest" class="block">Seleccionar Invitado Existente</label>
          <select v-model="selectedGuestId" @change="addExistingGuest" id="select-guest" class="input input-bordered w-full mb-4">
            <option value="" disabled>Seleccione un invitado...</option>
            <option v-for="guest in existingGuests" :key="guest.idInvitado" :value="guest.idInvitado">
              {{ guest.nombre }}
            </option>
          </select>
        </div>

        <!-- Creación de Nuevo Invitado -->
        <h4 class="text-md font-semibold mt-4">O Crear Nuevo Invitado</h4>
        <div class="mb-4">
          <label for="nombre" class="block">Nombre</label>
          <input v-model="newGuest.nombre" id="nombre" type="text" class="input input-bordered w-full" />
        </div>
        <div class="mb-4">
          <label for="dependencia" class="block">Dependencia</label>
          <input v-model="newGuest.dependencia" id="dependencia" type="text" class="input input-bordered w-full" />
        </div>
        <div class="mb-4">
          <label for="email" class="block">Email</label>
          <input v-model="newGuest.email" id="email" type="email" class="input input-bordered w-full" />
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button type="submit" class="btn btn-primary">Agregar Invitado</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { fetchExistingGuests, createGuest } from '../../services/sesionServices.ts';

// Props
const props = defineProps({
  show: Boolean,
});

// Emitir eventos
const emit = defineEmits(['close', 'add-invitado']);

// Estados reactivos
const existingGuests = ref([]); // Lista de invitados existentes
const selectedGuestId = ref(null); // ID del invitado seleccionado del select
const newGuest = ref({ nombre: '', dependencia: '', email: '' }); // Datos de un nuevo invitado

// Obtener lista de invitados existentes al montar el componente
onMounted(async () => {
  try {
    existingGuests.value = await fetchExistingGuests();
    console.log('Invitados obtenidos:', existingGuests.value); // Verificación de datos
  } catch (error) {
    console.error('Error al cargar la lista de invitados:', error);
  }
});

// Cerrar modal
const closeModal = () => {
  emit('close');
};

// Función para agregar invitado existente a la sesión
const addExistingGuest = () => {
  const selectedGuest = existingGuests.value.find(guest => guest.idInvitado === selectedGuestId.value);
  if (selectedGuest) {
    emit('add-invitado', selectedGuest);
    selectedGuestId.value = null; // Limpiar selección
    closeModal(); // Cerrar modal automáticamente si lo prefieres
  }
};

// Función para agregar o crear invitado y cerrar el modal
const submitGuest = async () => {
  try {
    if (selectedGuestId.value) {
      // Selecciona invitado existente
      const selectedGuest = existingGuests.value.find(guest => guest.idInvitado === selectedGuestId.value);
      if (selectedGuest) emit('add-invitado', selectedGuest);
    } else {
      // Crear nuevo invitado
      const createdGuest = await createGuest(newGuest.value);
      if (createdGuest) emit('add-invitado', createdGuest);
    }
    // Resetear formulario y cerrar modal
    resetForm();
    closeModal();
  } catch (error) {
    console.error('Error al agregar o seleccionar invitado:', error);
  }
};

// Función para resetear el formulario
const resetForm = () => {
  newGuest.value = { nombre: '', dependencia: '', email: '' };
  selectedGuestId.value = null;
};
</script>
