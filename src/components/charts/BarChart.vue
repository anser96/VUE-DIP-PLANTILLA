<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registro de plugins de ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Definición de props para los datos y opciones del gráfico
const props = defineProps<{
  chartData: any,
  chartOptions: any
}>();
</script>

<template>
  <!-- Renderiza el componente Bar utilizando los props pasados -->
  <Bar :data="chartData" :options="chartOptions" />
</template>
