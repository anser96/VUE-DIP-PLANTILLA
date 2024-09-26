<script setup>
import { ref, watch } from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue'
import { BuildingOfficeIcon } from '@heroicons/vue/24/solid'
import axios from "axios";

const datos = ref([]);
const facultades = ref([]);
const facultadSeleccionada = ref(''); // Facultad seleccionada para el filtro
const datosFiltrados = ref([]); // Datos que se mostrarán en la tabla

// Cargar los datos de la API
function loadData() {
    axios.get('https://www.datos.gov.co/resource/tnus-a4s5.json')
        .then(function (response) {
            datos.value = response.data;
            facultades.value = [...new Set(response.data.map(item => item.facultad))]; // Obtener facultades únicas
            datosFiltrados.value = datos.value; // Inicialmente mostrar todos los datos
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Watch para aplicar el filtro cuando cambie la facultad seleccionada
watch(facultadSeleccionada, (nuevaFacultad) => {
    if (nuevaFacultad === '') {
        datosFiltrados.value = datos.value; // Si no se selecciona ninguna facultad, mostrar todos los datos
    } else {
        datosFiltrados.value = datos.value.filter(item => item.facultad === nuevaFacultad);
    }
});

</script>

<template>
    <BreadCrumb modulo="Hotel" accion="Listado" />

    <div class="grid grid-cols-2 my-6 text-gray-700">
        <div class="flex items-center">
            <BuildingOfficeIcon class="w-10" />
            <h2 class="mb-1 text-4xl font-bold dark:text-white">Listado de hoteles</h2>
        </div>
        <div class="flex justify-end space-x-4">
            <button @click="loadData()" type="button" class="boton-1">Cargar...</button>

            <!-- Select para filtrar por facultad -->
            <select v-model="facultadSeleccionada" class="px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Todas las facultades</option>
                <option v-for="facultad in facultades" :key="facultad" :value="facultad">
                    {{ facultad }}
                </option>
            </select>
        </div>
    </div>

    <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                <tr v-for="fila in datosFiltrados" :key="fila.periodo + fila.programa" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
                    <td class="px-6 py-4">{{ fila.estrato_3 ? fila.estrato_3 : '-' }}</td> <!-- Validar si existe -->
                    <td class="px-6 py-4">{{ fila.estrato_4 ? fila.estrato_4 : '-' }}</td> <!-- Validar si existe -->
                    <td class="px-6 py-4">{{ fila.estrato_5 ? fila.estrato_5 : '-' }}</td> <!-- Validar si existe -->
                    <td class="px-6 py-4">{{ fila.estrato_6 ? fila.estrato_6 : '-' }}</td> <!-- Validar si existe -->
                </tr>
            </tbody>
        </table>
    </div>
</template>
