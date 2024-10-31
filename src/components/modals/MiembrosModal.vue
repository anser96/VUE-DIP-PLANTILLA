<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="modal-content bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-bold mb-4">Agregar Miembro</h3>
        <form @submit.prevent="submitMember">
          <div class="mb-4">
            <label for="nombre" class="block">Nombre</label>
            <input v-model="miembro.nombre" id="nombre" type="text" class="input input-bordered w-full" required />
          </div>
          <div class="mb-4">
            <label for="cargo" class="block">Cargo</label>
            <input v-model="miembro.cargo" id="cargo" type="text" class="input input-bordered w-full" required />
          </div>
          <div class="mb-4">
            <label for="email" class="block">Email</label>
            <input v-model="miembro.email" id="email" type="email" class="input input-bordered w-full" required />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Agregar Miembro</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  
  // Props
  const props = defineProps({
    show: Boolean,
  });
  
  // Emitir eventos
  const emit = defineEmits(['close', 'add-miembro']);
  
  // Datos del miembro
  const miembro = ref({ nombre: '', cargo: '', email: '' });
  
  // Función para cerrar el modal
  const closeModal = () => {
    emit('close');
  };
  
  // Función para agregar el miembro y cerrar el modal
  const submitMember = () => {
    emit('add-miembro', miembro.value);
    closeModal();
  };
  </script>
  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  