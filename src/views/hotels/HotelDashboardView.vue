<script setup lang="ts">
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { filterByFaculty, getFaculties, getHotelData, getPrograms, getPeriods, HotelData } from '../../services/dataServices';
import { generateChartData, generateChartOptions } from '../../services/chartService';
import Dropdown from '../../components/Dropdown.vue';

// Registro de plugins de ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Variables reactivas con tipado correcto
const hotelData = ref<HotelData[]>([]);
const programs = ref<string[]>([]);  // Programas disponibles para la facultad seleccionada
const periods = ref<string[]>([]);   // Periodos disponibles en base a la selección de la facultad y el programa
const faculties = ref<string[]>([]);
const filteredData = ref<HotelData[]>([]);
const selectedProgram = ref<string>(''); // Se resetea cuando se cambia la facultad o el programa
const selectedPeriod = ref<string>('');
const selectedFaculty = ref<string>('');
const chartData = ref<any>({});
const chartOptions = ref<any>({});
const chartInstance = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<string>('');

// Configuración de paginación
const currentPage = ref<number>(1);
const itemsPerPageOptions = [5, 10, 20, 30, 50];
const itemsPerPage = ref<number>(10);
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// Función para cargar datos de hoteles
async function loadData(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    hotelData.value = await getHotelData();
    faculties.value = getFaculties(hotelData.value);
    periods.value = getPeriods(hotelData.value);    // Cargar todos los periodos sin relación con el programa
    filteredData.value = hotelData.value;
    generateChartDataForProgramAndPeriod();
  } catch (err) {
    error.value = 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Función para generar datos del gráfico según el programa y periodo seleccionados
function generateChartDataForProgramAndPeriod(): void {
  let programData = hotelData.value.filter((item: HotelData) => {
    return (selectedProgram.value === '' || item.programa === selectedProgram.value) && 
           (selectedPeriod.value === '' || item.periodo === selectedPeriod.value);
  });

  // Limitar a 100 registros si hay más de 100
  if (programData.length > 100) {
    programData = programData.slice(0, 100);
  }

  if (programData.length === 0) {
    chartData.value = {};
    return;
  }

  // Pasar múltiples registros al servicio `generateChartData`
  chartData.value = generateChartData(programData);
  chartOptions.value = generateChartOptions(`${selectedProgram.value || 'Todos los programas'} - ${selectedPeriod.value || 'Todos los periodos'}`);
}

// Función para actualizar los programas basados en la facultad seleccionada
function updateProgramsByFaculty(faculty: string): void {
  programs.value = getPrograms(hotelData.value.filter(item => item.facultad === faculty));
  selectedPeriod.value = ''; // Resetear periodo cuando se selecciona una nueva facultad
  selectedProgram.value = ''; // Resetear el programa cuando se cambia la facultad
  updatePeriodsByProgramAndFaculty(); // Actualizar periodos
}

// Función para actualizar los periodos basados en la facultad y el programa seleccionados
function updatePeriodsByProgramAndFaculty(): void {
  periods.value = getPeriods(hotelData.value.filter(item => {
    return (selectedFaculty.value === '' || item.facultad === selectedFaculty.value) &&
           (selectedProgram.value === '' || item.programa === selectedProgram.value);
  }));
}

// Función para resetear los filtros
function resetFilters(): void {
  selectedFaculty.value = '';
  selectedProgram.value = '';
  selectedPeriod.value = '';
  filteredData.value = hotelData.value;
  generateChartDataForProgramAndPeriod();
}

// Redimensionar el gráfico cuando cambia el tamaño de la ventana
function handleResize(): void {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
}

// Manejar cambios de página
function prevPage(): void {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
  window.addEventListener('resize', handleResize);
});

// Limpiar el event listener al desmontar
onBeforeUnmount((): void => {
  window.removeEventListener('resize', handleResize);
});

// Observar cambios en los filtros seleccionados para actualizar el gráfico
watch([selectedProgram, selectedPeriod], () => {
  generateChartDataForProgramAndPeriod();
  updateFilteredData(); // Actualizar la tabla también al cambiar programa y periodo
});

// Observar cambios en la facultad seleccionada para filtrar los datos de la tabla y los programas
watch(selectedFaculty, (newFaculty: string) => {
  currentPage.value = 1;
  filteredData.value = filterByFaculty(hotelData.value, newFaculty);
  selectedProgram.value = ''; // Resetear el programa cuando cambie la facultad
  updateProgramsByFaculty(newFaculty); // Actualizar los programas en base a la facultad seleccionada
});

// Función para actualizar la tabla filtrada por periodo y programa
function updateFilteredData(): void {
  filteredData.value = hotelData.value.filter(item => {
    return (selectedProgram.value === '' || item.programa === selectedProgram.value) &&
           (selectedPeriod.value === '' || item.periodo === selectedPeriod.value) &&
           (selectedFaculty.value === '' || item.facultad === selectedFaculty.value);
  });
}
</script>

<template>
    <BreadCrumb module="Hotel" action="Dashboard" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 text-gray-700 dark:text-gray-300">
      <div class="flex items-center">
        <h2 class="text-3xl font-bold dark:text-white">Bienvenido</h2>
      </div>
    </div>

    <!-- Botón de reset y filtros -->
    <div class="flex flex-col  space-y-4 lg:space-y-0 lg:space-x-4 mt-4 ">
        <div class="flex items-center">
            <h5 class="dark:text-white text-2xl font-bold">Filtros:</h5>
        </div>
        
        <div class="flex gap-4">
            <div class="flex flex-col items-center">
                <label for="selectedFaculty" class="font-bold mr-2">Facultad:</label>
                <Dropdown v-model="selectedFaculty" :programs="faculties" placeholder="Seleccione una Facultad" />
            </div>
            <div class="flex flex-col items-center">
                <label for="selectedProgram" class="font-bold mr-2">Programa:</label>
                <Dropdown v-model="selectedProgram" :programs="programs" placeholder="Seleccione un Programa" />
            </div>
            <div class="flex flex-col items-center">
                <label for="selectedPeriod" class="font-bold mr-2">Periodo:</label>
                <Dropdown v-model="selectedPeriod" :programs="periods" placeholder="Seleccione un Periodo" />
            </div>
            
            <!-- Botón para resetear los filtros -->
            <div class="flex">
                <button @click="resetFilters" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Resetear Filtros
                </button>
            </div>
        </div>

    </div>

    <!-- Mostrar mensaje de error si existe -->
    <div v-if="error" class="text-red-500 dark:text-red-400 mb-4">
      {{ error }}
    </div>

    <!-- Mostrar spinner mientras se carga -->
    <div v-if="loading" class="text-center my-4">
      <svg class="animate-spin h-8 w-8 text-blue-500 dark:text-blue-300 mx-auto"></svg>
    </div>

    <!-- Contenedor flex para la gráfica y la tabla -->
    <div class="flex flex-col lg:flex-row gap-6 my-6">

      <!-- Gráfico -->
      <div class="chart-container flex-1 lg:w-1/2" style="max-height: 400px;">
        <Bar v-if="chartData && chartData.datasets && chartData.datasets.length > 0" :data="chartData" :options="chartOptions" />
        <p v-else class="text-gray-500">Seleccione un programa y un periodo para ver el gráfico.</p>
      </div>

      <!-- Tabla de lista de hoteles -->
      <div class="relative overflow-x-auto shadow-md rounded-lg flex-1 lg:w-1/2">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Periodo</th>
              <th scope="col" class="px-6 py-3">Facultad</th>
              <th scope="col" class="px-6 py-3">Programa</th>
              <th scope="col" class="px-6 py-3">Total Matrícula</th>
              <th scope="col" class="px-6 py-3">Masculino</th>
              <th scope="col" class="px-6 py-3">Femenino</th>
              <th scope="col" class="px-6 py-3">Estrato 1</th>
              <th scope="col" class="px-6 py-3">Estrato 2</th>
              <th scope="col" class="px-6 py-3">Estrato 3</th>
              <th scope="col" class="px-6 py-3">Estrato 4</th>
              <th scope="col" class="px-6 py-3">Estrato 5</th>
              <th scope="col" class="px-6 py-3">Estrato 6</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in paginatedData" :key="row.periodo + row.programa" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ row.periodo }}
              </th>
              <td class="px-6 py-4">{{ row.facultad }}</td>
              <td class="px-6 py-4">{{ row.programa }}</td>
              <td class="px-6 py-4">{{ row.total_matricula }}</td>
              <td class="px-6 py-4">{{ row.sexo_masc }}</td>
              <td class="px-6 py-4">{{ row.sexo_feme }}</td>
              <td class="px-6 py-4">{{ row.estrato_1 }}</td>
              <td class="px-6 py-4">{{ row.estrato_2 }}</td>
              <td class="px-6 py-4">{{ row.estrato_3 || '-' }}</td>
              <td class="px-6 py-4">{{ row.estrato_4 || '-' }}</td>
              <td class="px-6 py-4">{{ row.estrato_5 || '-' }}</td>
              <td class="px-6 py-4">{{ row.estrato_6 || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Controles de paginación dentro del contenedor de la tabla -->
        <div class="flex justify-between items-center mt-4 p-4 bg-gray-100 dark:bg-gray-700">
          <div>
            <label for="itemsPerPage">Items por página:</label>
            <select id="itemsPerPage" v-model="itemsPerPage" class="ml-2 bg-white dark:bg-gray-800 border border-gray-300 rounded-md p-1">
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>

          <div class="flex space-x-4">
            <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 px-4 py-2 rounded-md">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-300 px-4 py-2 rounded-md">Siguiente</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredData.length === 0 && !loading" class="text-center my-4 text-gray-500 dark:text-gray-400">
      No se encontraron datos para la facultad seleccionada.
    </div>
</template>

