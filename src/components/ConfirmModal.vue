<template>
  <div v-if="show" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-96 p-6">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="mb-6">{{ message }}</p>
      
      <div class="flex justify-end gap-4">
        <button class="btn btn-secondary" @click="cancel">Cancelar</button>
        <button class="btn btn-error" @click="confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Mensaje'
  },
  message: {
    type: String,
    default: '¿Está seguro de que quiere continuar con la acción?'
  }
});

const emit = defineEmits(['confirm', 'cancel']); 

const confirm = () => {
  emit('confirm'); // Emitir evento "confirm"
};

const cancel = () => {
  emit('cancel'); // Emitir evento "cancel"
};
</script>
