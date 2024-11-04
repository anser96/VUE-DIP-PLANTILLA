// src/services/sesionService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";

import { ApiResponse, Sesion, ApiResponseSesionDTO } from "../Utils/Interfaces/MeetingRecords";

const API_SESIONES_URL = `${import.meta.env.VITE_API_URL}/sesiones`;

// Obtener todas las sesiones
export const getSesiones = async (): Promise<ApiResponse<Sesion[]>> => {
  try {
    const response = await fetchWithAuth(API_SESIONES_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener las sesiones');
    return await response.json() as ApiResponse<Sesion[]>;
  } catch (error) {
    console.error('Error al obtener las sesiones:', error);
    throw error;
  }
};

// Obtener una sesión por ID
export const getSesionById = async (id: number): Promise<ApiResponseSesionDTO> => {
  try {
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener la sesión con ID: ${id}`);
    return await response.json() as ApiResponseSesionDTO;
  } catch (error) {
    console.error(`Error al obtener la sesión con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva sesión
export const createSesion = async (sesion: Partial<Sesion>): Promise<ApiResponseSesionDTO> => {
  try {
    const response = await fetchWithAuth(API_SESIONES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sesion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al crear la sesión';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponseSesionDTO;
  } catch (error) {
    console.error('Error al crear la sesión:', error);
    throw error;
  }
};

// Actualizar una sesión existente
export const updateSesion = async (id: number, sesion: Partial<Sesion>): Promise<ApiResponseSesionDTO> => {
  try {
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sesion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar la sesión';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponseSesionDTO;
  } catch (error) {
    console.error('Error al actualizar la sesión:', error);
    throw error;
  }
};

// Eliminar una sesión
export const deleteSesion = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la sesión');
    return await response.json() as ApiResponse<null>;
  } catch (error) {
    console.error('Error al eliminar la sesión:', error);
    throw error;
  }
};

// Definir el contenido de una sesión
export const definirContenidoSesion = async (idSesion: number, contenido: string): Promise<void> => {
  try {
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${idSesion}/definir-contenido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido }),
    });

    if (!response.ok) {
      throw new Error('Error al definir el contenido de la sesión');
    }
  } catch (error) {
    console.error('Error al definir el contenido de la sesión:', error);
    throw error;
  }
};
