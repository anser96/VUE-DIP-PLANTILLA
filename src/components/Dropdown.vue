<script setup>
import { ref, watch } from 'vue' 

// Props que el componente acepta
const props = defineProps({
  programas: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Selecciona una opción',  // Añadir un valor predeterminado para la prop placeholder
  },
})

// Variables internas del componente
const isOpen = ref(false)
const programaSeleccionado = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  programaSeleccionado.value = newValue
})

// Métodos para manejar el dropdown
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectPrograma(programa) {
  programaSeleccionado.value = programa
  isOpen.value = false
  emit('update:modelValue', programa)  // Emitir el valor seleccionado al componente padre
}

// Emitir el valor seleccionado al componente padre
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative">
    <button @click="toggleDropdown" class="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-transparent text-black dark:text-white focus:outline-none">
      {{ programaSeleccionado || placeholder }} <!-- Usamos la prop placeholder aquí -->
    </button>
    
    <div v-if="isOpen" class="absolute w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 mt-2 rounded shadow-lg z-10">
      <div 
        v-for="programa in programas" 
        :key="programa" 
        @click="selectPrograma(programa)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white">
        {{ programa }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
