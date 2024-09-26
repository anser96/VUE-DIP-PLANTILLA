<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const datos = ref([]) // Datos completos de la API
const programas = ref([]) // Lista de programas únicos
const programaSeleccionado = ref('') // Programa seleccionado para el gráfico
const chartData = ref({}) // Datos del gráfico
const chartOptions = ref({}) // Opciones del gráfico

// Función para cargar los datos desde la API
function loadData() {
  axios.get('https://www.datos.gov.co/resource/tnus-a4s5.json')
    .then(function (response) {
      datos.value = response.data
      // Extraer los programas únicos
      programas.value = [...new Set(response.data.map(item => item.programa))]
    })
    .catch(function (error) {
      console.log(error)
    })
}

// Función para generar el gráfico basado en el programa seleccionado
function generateChartData(programa) {
  const programaDatos = datos.value.find(item => item.programa === programa)

  // Si no hay datos, limpiar el gráfico
  if (!programaDatos) {
    chartData.value = {}
    return
  }

  // Definir los estratos y sus valores
  const estratos = ['estrato_1', 'estrato_2', 'estrato_3', 'estrato_4', 'estrato_5', 'estrato_6']
  const valoresEstratos = estratos.map(estrato => programaDatos[estrato] ? parseInt(programaDatos[estrato]) : 0)

  chartData.value = {
    labels: estratos.map(estrato => estrato.replace('_', ' ').toUpperCase()), // Etiquetas de los estratos
    datasets: [{
      label: `Distribución de Estratos en ${programa}`,
      backgroundColor: '#42a5f5',
      data: valoresEstratos,
    }],
  }

  chartOptions.value = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Distribución de Estratos en ${programa}`,
      },
    },
  }
}

// Watch para detectar cuando se selecciona un programa y generar el gráfico
watch(programaSeleccionado, (nuevoPrograma) => {
  if (nuevoPrograma) {
    generateChartData(nuevoPrograma)
  }
})

</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-4">Gráfico de Estratos por Programa</h2>

    <div class="flex justify-between items-center mb-4">
      <button @click="loadData" class="bg-blue-500 text-white px-4 py-2 rounded">Cargar Datos</button>
      
      <select v-model="programaSeleccionado" class="border border-gray-300 px-4 py-2 rounded">
        <option value="">Selecciona un programa</option>
        <option v-for="programa in programas" :key="programa" :value="programa">
          {{ programa }}
        </option>
      </select>
    </div>

    <div v-if="chartData && chartData.datasets && chartData.datasets.length > 0">
      <!-- Renderizamos el gráfico con Chart.js -->
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else>
      <p class="text-gray-500">Selecciona un programa para ver el gráfico</p>
    </div>
  </div>
</template>
