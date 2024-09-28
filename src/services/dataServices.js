import axios from 'axios';

// URL de la API
const API_URL = 'https://www.datos.gov.co/resource/tnus-a4s5.json';

// Función para obtener todos los datos de la API
export async function getDatos() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return [];
  }
}

// Función para obtener facultades únicas de los datos
export function getFacultades(datos) {
  return [...new Set(datos.map(item => item.facultad))];
}

// Función para obtener programas únicos de los datos
export function getProgramas(datos) {
  return [...new Set(datos.map(item => item.programa))];
}

// Función para filtrar los datos por facultad
export function filtrarPorFacultad(datos, facultad) {
  if (!facultad) {
    return datos;
  }
  return datos.filter(item => item.facultad === facultad);
}

// Función para obtener datos de un programa específico
export function obtenerDatosPorPrograma(datos, programa) {
  return datos.find(item => item.programa === programa);
}
