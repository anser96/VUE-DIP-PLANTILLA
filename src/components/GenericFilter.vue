<template>
    <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full"> <!-- max-w-lg cambiado a max-w-3xl para aumentar el ancho -->
        <h2 class="text-xl font-bold mb-4">Filtrar Sesiones</h2>
        <div class="flex flex-wrap gap-4 mb-4">
          <div v-for="filter in filters" :key="filter.key" class="flex flex-col w-full"> <!-- w-full aplicado para ocupar todo el ancho disponible -->
            <label :for="filter.key" class="font-semibold mb-1">{{ filter.label }}</label>
            <input
              v-if="filter.type === 'text'"
              type="text"
              v-model="filterValues[filter.key]"
              :placeholder="filter.placeholder"
              class="input input-bordered w-full"
            />
            <input
              v-else-if="filter.type === 'date'"
              type="date"
              v-model="filterValues[filter.key]"
              class="input input-bordered w-full"
            />
            <select
              v-else-if="filter.type === 'select'"
              v-model="filterValues[filter.key]"
              class="select select-bordered w-full"
            >
              <option v-for="option in filter.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button @click="applyFilters" class="btn btn-primary">Aplicar Filtro</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, defineProps, defineEmits } from 'vue';
  
  interface FilterOption {
    label: string;
    value: string | number;
  }
  
  interface Filter {
    key: string;
    label: string;
    type: 'text' | 'date' | 'select';
    placeholder?: string;
    options?: FilterOption[];
  }
  
  const props = defineProps<{ filters: Filter[]; isModalVisible: boolean }>();
  const emit = defineEmits(['filter', 'close']);
  
  const filterValues = reactive<Record<string, string>>({});
  
  props.filters.forEach(filter => {
    filterValues[filter.key] = '';
  });
  
  const applyFilters = () => {
    emit('filter', { ...filterValues });
    emit('close');
  };
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .fixed {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input,
  .select {
    padding: 0.75rem; /* Aumentar el relleno para que los campos sean más cómodos de usar */
  }
  </style>
  