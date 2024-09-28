<script setup>
import { ref, watch, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import Dropdown from '@/components/Dropdown.vue';
import { getDatos, getProgramas, obtenerDatosPorPrograma } from '@/services/dataServices';
import { generarDatosGraficoEstratos, generarOpcionesGrafico } from '@/services/chartService';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const datos = ref([]);
const programas = ref([]);
const programaSeleccionado = ref('');
const chartData = ref({});
const chartOptions = ref({});
const error = ref('');

// Cargar los datos de la API
async function loadData() {
  try {
    datos.value = await getDatos();
    programas.value = getProgramas(datos.value);
    error.value = ''; // Limpiar errores anteriores
  } catch (err) {
    error.value = 'Error al cargar los datos. Inténtalo de nuevo más tarde.';
    console.error(err);
  }
}

// Función para generar los datos del gráfico
function generateChartData(programa) {
  const programaDatos = obtenerDatosPorPrograma(datos.value, programa);
  if (!programaDatos) {
    chartData.value = {};
    return;
  }

  chartData.value = generarDatosGraficoEstratos(programaDatos);
  chartOptions.value = generarOpcionesGrafico(programa);
}

// Cargar los datos al montar el componente
onMounted(() => {
  loadData();
});

// Watch para regenerar el gráfico cuando cambie el programa seleccionado
watch(programaSeleccionado, (nuevoPrograma) => {
  generateChartData(nuevoPrograma);
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-4">Gráfico de Estratos por Programa</h2>

    <div v-if="error" class="mb-4 text-red-500">{{ error }}</div>

    <div class="flex justify-between items-center mb-4">
      <Dropdown v-model="programaSeleccionado" :programas="programas" />
    </div>

    <div v-if="chartData && chartData.datasets && chartData.datasets.length > 0">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else>
      <p class="text-gray-500">Selecciona un programa para ver el gráfico</p>
    </div>
  </div>
</template>
