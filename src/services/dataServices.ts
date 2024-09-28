import axios from 'axios';

// URL de la API
const API_URL = 'https://www.datos.gov.co/resource/tnus-a4s5.json';

// Definición de tipo para los datos
export interface HotelData {
  facultad: string;
  programa: string;
  periodo: string;
  total_matricula: string;
  sexo_masc: string;
  sexo_feme: string;
  estrato_1: string;
  estrato_2: string;
  estrato_3?: string;
  estrato_4?: string;
  estrato_5?: string;
  estrato_6?: string;
}

// Función para obtener todos los datos de la API
export async function getHotelData(): Promise<HotelData[]> {
  try {
    const response = await axios.get<HotelData[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return [];
  }
}

// Función para obtener facultades únicas de los datos
export function getFaculties(data: HotelData[]): string[] {
  return [...new Set(data.map(item => item.facultad))];
}

// Función para obtener programas únicos de los datos
export function getPrograms(data: HotelData[]): string[] {
  return [...new Set(data.map(item => item.programa))];
}

// Función para obtener periodos únicos de los datos
export function getPeriods(data: HotelData[]): string[] {
  return [...new Set(data.map(item => item.periodo))];
}

// Función para filtrar los datos por facultad
export function filterByFaculty(data: HotelData[], faculty: string): HotelData[] {
  if (!faculty) {
    return data;
  }
  return data.filter(item => item.facultad === faculty);
}

// Función para obtener datos de un programa específico
export function getDataByProgram(data: HotelData[], program: string): HotelData | undefined {
  return data.find(item => item.programa === program);
}
