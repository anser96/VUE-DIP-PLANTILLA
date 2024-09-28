<script setup lang="ts">
import { ref, watch } from 'vue'

// Props que el componente acepta
const props = defineProps<{
    programs: string[],
    modelValue: string,
    placeholder: string
}>()

// Variables internas del componente
const isOpen = ref<boolean>(false)
const selectedProgram = ref<string>(props.modelValue)

// Emitir el valor seleccionado al componente padre
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

// Observador para actualizar el valor
watch(() => props.modelValue, (newValue) => {
    selectedProgram.value = newValue
})

// Métodos para manejar el dropdown
function toggleDropdown(): void {
    isOpen.value = !isOpen.value
}

function selectProgram(program: string): void {
    selectedProgram.value = program
    isOpen.value = false
    emit('update:modelValue', program)
}
</script>

<template>
    <div class="relative">
        <button @click="toggleDropdown" class="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-transparent text-black dark:text-white focus:outline-none">
            {{ selectedProgram || placeholder }}
        </button>
        <div v-if="isOpen" class="absolute w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 mt-2 rounded shadow-lg z-10">
            <div 
                v-for="program in programs" 
                :key="program" 
                @click="selectProgram(program)"
                class="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white">
                {{ program }}
            </div>
        </div>
    </div>
</template>
