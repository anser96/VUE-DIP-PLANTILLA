<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue'
import { BuildingOfficeIcon } from '@heroicons/vue/24/solid'
import axios from 'axios'
import Dropdown from '../components/Dropdown.vue' // Importa tu componente de Dropdown personalizado

const datos = ref([])
const facultades = ref([])
const facultadSeleccionada = ref('') // Facultad seleccionada para el filtro
const datosFiltrados = ref([]) // Datos que se mostrarán en la tabla
const loading = ref(false) // Indicador de carga
const error = ref('') // Manejar posibles errores

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10) // Número de elementos por página
const totalPages = computed(() => Math.ceil(datosFiltrados.value.length / itemsPerPage.value))

// Filtrar los datos según la página actual
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return datosFiltrados.value.slice(start, end)
})

// Cambiar a la página siguiente
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

// Cambiar a la página anterior
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

// Cargar los datos de la API
async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://www.datos.gov.co/resource/tnus-a4s5.json')
    datos.value = response.data
    facultades.value = [...new Set(response.data.map(item => item.facultad))]
    datosFiltrados.value = datos.value
  } catch (err) {
    error.value = 'Error al cargar los datos. Inténtalo de nuevo más tarde.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Watch para aplicar el filtro cuando cambie la facultad seleccionada
watch(facultadSeleccionada, (nuevaFacultad) => {
  currentPage.value = 1 // Reiniciar la paginación al cambiar el filtro
  if (nuevaFacultad === '') {
    datosFiltrados.value = datos.value
  } else {
    datosFiltrados.value = datos.value.filter(item => item.facultad === nuevaFacultad)
  }
})

// Cargar los datos al montar el componente
onMounted(() => {
  loadData()
})
</script>

<template>
  <BreadCrumb modulo="Hotel" accion="Listado" />

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 text-gray-700 dark:text-gray-300">
    <div class="flex items-center">
      <BuildingOfficeIcon class="w-10 text-blue-500" />
      <h2 class="ml-4 text-3xl font-bold dark:text-white">Listado de Hoteles</h2>
    </div>
    <div class="flex justify-end items-center space-x-4">
      <!-- Componente Dropdown personalizado -->
      <Dropdown 
        v-model="facultadSeleccionada" 
        :programas="facultades" 
      />
    </div>
  </div>

  <!-- Mostrar mensaje de error si existe -->
  <div v-if="error" class="text-red-500 dark:text-red-400 mb-4">
    {{ error }}
  </div>

  <!-- Mostrar spinner de carga mientras se cargan los datos -->
  <div v-if="loading" class="text-center my-4">
    <svg class="animate-spin h-8 w-8 text-blue-500 dark:text-blue-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"></path>
    </svg>
  </div>

  <div class="relative overflow-x-auto shadow-md rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Periodo</th>
          <th scope="col" class="px-6 py-3">Facultad</th>
          <th scope="col" class="px-6 py-3">Programa</th>
          <th scope="col" class="px-6 py-3">Total matrícula</th>
          <th scope="col" class="px-6 py-3">Masculino</th>
          <th scope="col" class="px-6 py-3">Femenino</th>
          <th scope="col" class="px-6 py-3">Est1</th>
          <th scope="col" class="px-6 py-3">Est2</th>
          <th scope="col" class="px-6 py-3">Est3</th>
          <th scope="col" class="px-6 py-3">Est4</th>
          <th scope="col" class="px-6 py-3">Est5</th>
          <th scope="col" class="px-6 py-3">Est6</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fila in paginatedData" :key="fila.periodo + fila.programa" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ fila.periodo }}
          </th>
          <td class="px-6 py-4">{{ fila.facultad }}</td>
          <td class="px-6 py-4">{{ fila.programa }}</td>
          <td class="px-6 py-4">{{ fila.total_matricula }}</td>
          <td class="px-6 py-4">{{ fila.sexo_masc }}</td>
          <td class="px-6 py-4">{{ fila.sexo_feme }}</td>
          <td class="px-6 py-4">{{ fila.estrato_1 }}</td>
          <td class="px-6 py-4">{{ fila.estrato_2 }}</td>
          <td class="px-6 py-4">{{ fila.estrato_3 ? fila.estrato_3 : '-' }}</td>
          <td class="px-6 py-4">{{ fila.estrato_4 ? fila.estrato_4 : '-' }}</td>
          <td class="px-6 py-4">{{ fila.estrato_5 ? fila.estrato_5 : '-' }}</td>
          <td class="px-6 py-4">{{ fila.estrato_6 ? fila.estrato_6 : '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Controles de paginación -->
  <div class="flex justify-between items-center mt-4">
    <button 
      @click="prevPage" 
      :disabled="currentPage === 1" 
      class="bg-gray-300 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800">
      Anterior
    </button>
    <span>Página {{ currentPage }} de {{ totalPages }}</span>
    <button 
      @click="nextPage" 
      :disabled="currentPage === totalPages" 
      class="bg-gray-300 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800">
      Siguiente
    </button>
  </div>

  <!-- Mostrar mensaje si no hay datos después de filtrar -->
  <div v-if="datosFiltrados.length === 0 && !loading" class="text-center my-4 text-gray-500 dark:text-gray-400">
    No se encontraron datos para la facultad seleccionada.
  </div>
</template>
