// src/services/solicitanteService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";
import { ApiResponse, Solicitud } from "../Utils/Interfaces/MeetingRecords";

const API_SOLICITANTES_URL = `${import.meta.env.VITE_API_URL}/solicitantes`;

// Obtener todos los solicitantes
export const getSolicitantes = async (): Promise<ApiResponse<Solicitud[]>> => {
  try {
    const response = await fetchWithAuth(API_SOLICITANTES_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener los solicitantes');
    return await response.json() as ApiResponse<Solicitud[]>;
  } catch (error) {
    console.error('Error al obtener los solicitantes:', error);
    throw error;
  }
};

// Obtener un solicitante por ID
export const getSolicitanteById = async (id: number): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(`${API_SOLICITANTES_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener el solicitante con ID: ${id}`);
    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error(`Error al obtener el solicitante con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo solicitante
export const createSolicitante = async (solicitante: Partial<Solicitud>): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(API_SOLICITANTES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solicitante),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al crear el solicitante';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error('Error al crear el solicitante:', error);
    throw error;
  }
};

// Actualizar un solicitante existente
export const updateSolicitante = async (id: number, solicitante: Partial<Solicitud>): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(`${API_SOLICITANTES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solicitante),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar el solicitante';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error('Error al actualizar el solicitante:', error);
    throw error;
  }
};

// Eliminar un solicitante
export const deleteSolicitante = async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await fetchWithAuth(`${API_SOLICITANTES_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el solicitante');
      return await response.json() as ApiResponse<null>;
    } catch (error) {
      console.error('Error al eliminar el solicitante:', error);
      throw error;
    }
  };