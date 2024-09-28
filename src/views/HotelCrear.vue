<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Bar } from 'vue-chartjs';
import Dropdown from '@/components/Dropdown.vue';
import { getDatos, getProgramas, obtenerDatosPorPrograma } from '@/services/dataServices';
import { generarDatosGraficoEstratos, generarOpcionesGrafico } from '@/services/chartService';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Variables y referencias reactivas
const datos = ref([]);
const programas = ref([]);
const periodos = ref([]);
const programaSeleccionado = ref('');
const periodoSeleccionado = ref('');
const chartData = ref({});
const chartOptions = ref({});
const chartInstance = ref(null);  // Guardamos la instancia del gráfico
const error = ref('');

// Función para cargar los datos desde la API
async function loadData() {
  try {
    datos.value = await getDatos();
    programas.value = getProgramas(datos.value);
    error.value = '';
  } catch (err) {
    error.value = 'Error al cargar los datos. Inténtalo de nuevo más tarde.';
    console.error(err);
  }
}

// Función para actualizar la lista de periodos disponibles según el programa seleccionado
function updatePeriodos(programa) {
  const programaDatos = datos.value.filter(item => item.programa === programa);
  periodos.value = [...new Set(programaDatos.map(item => item.periodo))];
}

// Función para generar el gráfico basado en el programa y el periodo seleccionados
function generateChartData(programa, periodo) {
  const programaDatos = datos.value.find(item => item.programa === programa && item.periodo === periodo);

  if (!programaDatos) {
    chartData.value = {};
    return;
  }

  chartData.value = generarDatosGraficoEstratos(programaDatos);
  chartOptions.value = generarOpcionesGrafico(`${programa} - ${periodo}`);
}

// Función para redimensionar el gráfico cuando la ventana cambie de tamaño
function handleResize() {
  if (chartInstance.value) {
    chartInstance.value.resize();  // Forzar redimensionado
  }
}

// Cargar los datos cuando el componente se monta
onMounted(() => {
  loadData();
  window.addEventListener('resize', handleResize);  // Escuchar el evento resize
});

// Limpiar el evento resize cuando se destruya el componente
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// Detectar el cambio en la selección del programa y actualizar los periodos
watch(programaSeleccionado, (nuevoPrograma) => {
  if (nuevoPrograma) {
    updatePeriodos(nuevoPrograma);
    periodoSeleccionado.value = '';  // Reiniciar la selección del periodo
  }
});

// Detectar el cambio en la selección del periodo y regenerar el gráfico
watch([programaSeleccionado, periodoSeleccionado], ([nuevoPrograma, nuevoPeriodo]) => {
  if (nuevoPrograma && nuevoPeriodo) {
    generateChartData(nuevoPrograma, nuevoPeriodo);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-4">Gráfico de Estratos por Programa y Periodo</h2>

    <!-- Mostrar error si ocurre -->
    <div v-if="error" class="mb-4 text-red-500">{{ error }}</div>

    <div class="flex justify-between items-center mb-4">
      <!-- Dropdown para seleccionar el Programa -->
      <Dropdown v-model="programaSeleccionado" :programas="programas" placeholder="Selecciona un programa" />

      <!-- Dropdown para seleccionar el Periodo basado en el programa seleccionado -->
      <Dropdown v-if="periodos.length > 0" v-model="periodoSeleccionado" :programas="periodos" placeholder="Selecciona un periodo" />
    </div>

    <!-- Contenedor del gráfico ajustado -->
    <div class="chart-container">
      <div class="chart-wrapper">
        <Bar v-if="chartData && chartData.datasets && chartData.datasets.length > 0" :data="chartData" :options="chartOptions" />
        <p v-else class="text-gray-500">Selecciona un programa y un periodo para ver el gráfico</p>
      </div>
    </div>
  </div>
</template>

