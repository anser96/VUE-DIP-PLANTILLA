<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Agregar Acta</h2>
        <!-- Contenido del modal -->
        <input v-model="acta.estado" type="text" placeholder="Estado del acta" class="input input-bordered mb-4" />
        
        <div class="flex justify-end space-x-4">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="addActaAndClose">Agregar</button>
        </div>
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
  const emit = defineEmits(['close', 'add-acta']);
  
  // Datos del acta
  const acta = ref({ estado: 'PENDIENTE' });
  
  // Función para cerrar el modal
  const closeModal = () => {
    emit('close');
  };
  
  // Función para agregar el acta y cerrar el modal
  const addActaAndClose = () => {
    emit('add-acta', acta.value);
    closeModal();
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales para centrar el modal y el fondo */
  .fixed {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 50;
    background-color: rgba(0, 0, 0, 0.5);
  }
  </style>
  