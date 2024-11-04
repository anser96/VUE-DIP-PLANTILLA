<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg">
      <h3 class="text-lg font-bold">Agregar Invitado</h3>
      <form @submit.prevent="addInvitadoAndClose">
        <div class="mb-4">
          <label for="nombre" class="block">Nombre</label>
          <input v-model="invitado.nombre" id="nombre" type="text" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label for="dependencia" class="block">Dependencia</label>
          <input v-model="invitado.dependencia" id="dependencia" type="text" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label for="email" class="block">Email</label>
          <input v-model="invitado.email" id="email" type="email" class="input input-bordered w-full" required />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button type="submit" class="btn btn-primary">Agregar Invitado</button>
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
const emit = defineEmits(['close', 'add-invitado']);

// Datos del invitado
const invitado = ref({ nombre: '', dependencia: '', email: '' });

// Función para cerrar el modal
const closeModal = () => {
  emit('close');
};

// Función para agregar el invitado, limpiar el formulario y cerrar el modal
const addInvitadoAndClose = () => {
  emit('add-invitado', { ...invitado.value });
  // Limpiar el formulario
  invitado.value = { nombre: '', dependencia: '', email: '' };
  closeModal();
};
</script>
