<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg">
      <h3 class="text-lg font-bold">Agregar Miembro</h3>
      <form @submit.prevent="submitMember">
        <!-- Selección de Miembro Existente -->
        <div class="mb-4">
          <label for="select-member" class="block">Seleccionar Miembro Existente</label>
          <select v-model="selectedMemberId" @change="addExistingMember" id="select-member" class="input input-bordered w-full mb-4">
            <option value="" disabled>Seleccione un miembro...</option>
            <option v-for="member in existingMembers" :key="member.idMiembro" :value="member.idMiembro">
              {{ member.nombre }}
            </option>
          </select>
        </div>

        <!-- Creación de Nuevo Miembro -->
        <h4 class="text-md font-semibold mt-4">O Crear Nuevo Miembro</h4>
        <div class="mb-4">
          <label for="nombre" class="block">Nombre</label>
          <input v-model="newMember.nombre" id="nombre" type="text" class="input input-bordered w-full" />
        </div>
        <div class="mb-4">
          <label for="cargo" class="block">Cargo</label>
          <input v-model="newMember.cargo" id="cargo" type="text" class="input input-bordered w-full" />
        </div>
        <div class="mb-4">
          <label for="email" class="block">Email</label>
          <input v-model="newMember.email" id="email" type="email" class="input input-bordered w-full" />
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button type="submit" class="btn btn-primary">Agregar Miembro</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { fetchExistingMembers, createMember } from '../../services/sesionServices.ts';

// Props
const props = defineProps({
  show: Boolean,
});

// Emitir eventos
const emit = defineEmits(['close', 'add-miembro']);

// Estados reactivos
const existingMembers = ref([]); // Lista de miembros existentes
const selectedMemberId = ref(null); // ID del miembro seleccionado del select
const newMember = ref({ nombre: '', cargo: '', email: '' }); // Datos de un nuevo miembro

// Obtener lista de miembros existentes al montar el componente
onMounted(async () => {
  try {
    existingMembers.value = await fetchExistingMembers();
    console.log('Miembros obtenidos:', existingMembers.value); // Verificación de datos
  } catch (error) {
    console.error('Error al cargar la lista de miembros:', error);
  }
});

// Cerrar modal
const closeModal = () => {
  emit('close');
};

// Función para agregar miembro existente a la sesión
const addExistingMember = () => {
  const selectedMember = existingMembers.value.find(member => member.idMiembro === selectedMemberId.value);
  if (selectedMember) {
    emit('add-miembro', selectedMember);
    selectedMemberId.value = null; // Limpiar selección
    closeModal(); // Cerrar modal automáticamente si lo prefieres
  }
};

// Función para agregar o crear miembro y cerrar el modal
const submitMember = async () => {
  try {
    if (selectedMemberId.value) {
      // Selecciona miembro existente
      const selectedMember = existingMembers.value.find(member => member.idMiembro === selectedMemberId.value);
      if (selectedMember) emit('add-miembro', selectedMember);
    } else {
      // Crear nuevo miembro
      const createdMember = await createMember(newMember.value);
      if (createdMember) emit('add-miembro', createdMember);
    }
    // Resetear formulario y cerrar modal
    resetForm();
    closeModal();
  } catch (error) {
    console.error('Error al agregar o seleccionar miembro:', error);
  }
};

// Función para resetear el formulario
const resetForm = () => {
  newMember.value = { nombre: '', cargo: '', email: '' };
  selectedMemberId.value = null;
};
</script>
