// src/services/miembroService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";
import { Miembro, ApiResponse } from "../Utils/Interfaces/MeetingRecords";

const API_MIEMBROS_URL = `${import.meta.env.VITE_API_URL}/miembros`;

// Obtener todos los miembros
export const getMiembros = async (): Promise<ApiResponse<Miembro[]>> => {
  try {
    const response = await fetchWithAuth(API_MIEMBROS_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener los miembros');
    return await response.json() as ApiResponse<Miembro[]>;
  } catch (error) {
    console.error('Error al obtener los miembros:', error);
    throw error;
  }
};

// Obtener un miembro por ID
export const getMiembroById = async (id: number): Promise<ApiResponse<Miembro>> => {
  try {
    const response = await fetchWithAuth(`${API_MIEMBROS_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener el miembro con ID: ${id}`);
    return await response.json() as ApiResponse<Miembro>;
  } catch (error) {
    console.error(`Error al obtener el miembro con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo miembro
export const createMiembro = async (miembro: Partial<Miembro>): Promise<ApiResponse<Miembro>> => {
  try {
    const response = await fetchWithAuth(API_MIEMBROS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(miembro),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al crear el miembro';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Miembro>;
  } catch (error) {
    console.error('Error al crear el miembro:', error);
    throw error;
  }
};

// Actualizar un miembro existente
export const updateMiembro = async (id: number, miembro: Partial<Miembro>): Promise<ApiResponse<Miembro>> => {
  try {
    const response = await fetchWithAuth(`${API_MIEMBROS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(miembro),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar el miembro';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Miembro>;
  } catch (error) {
    console.error('Error al actualizar el miembro:', error);
    throw error;
  }
};

// Eliminar un miembro
export const deleteMiembro = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = await fetchWithAuth(`${API_MIEMBROS_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el miembro');
    return await response.json() as ApiResponse<null>;
  } catch (error) {
    console.error('Error al eliminar el miembro:', error);
    throw error;
  }
};
