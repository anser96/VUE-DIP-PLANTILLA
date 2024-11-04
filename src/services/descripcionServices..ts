// src/services/descripcionService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";
import { ApiResponse, Descripcion } from "../Utils/Interfaces/MeetingRecords";

const API_DESCRIPCIONES_URL = `${import.meta.env.VITE_API_URL}/descripciones`;

// Obtener todas las descripciones
export const getDescripciones = async (): Promise<ApiResponse<Descripcion[]>> => {
  try {
    const response = await fetchWithAuth(API_DESCRIPCIONES_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener las descripciones');
    return await response.json() as ApiResponse<Descripcion[]>;
  } catch (error) {
    console.error('Error al obtener las descripciones:', error);
    throw error;
  }
};

// Obtener una descripción por ID
export const getDescripcionById = async (id: number): Promise<ApiResponse<Descripcion>> => {
  try {
    const response = await fetchWithAuth(`${API_DESCRIPCIONES_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener la descripción con ID: ${id}`);
    return await response.json() as ApiResponse<Descripcion>;
  } catch (error) {
    console.error(`Error al obtener la descripción con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva descripción
export const createDescripcion = async (descripcion: Partial<Descripcion>): Promise<ApiResponse<Descripcion>> => {
  try {
    const response = await fetchWithAuth(API_DESCRIPCIONES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(descripcion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al crear la descripción';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Descripcion>;
  } catch (error) {
    console.error('Error al crear la descripción:', error);
    throw error;
  }
};

// Actualizar una descripción existente
export const updateDescripcion = async (id: number, descripcion: Partial<Descripcion>): Promise<ApiResponse<Descripcion>> => {
  try {
    const response = await fetchWithAuth(`${API_DESCRIPCIONES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(descripcion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar la descripción';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Descripcion>;
  } catch (error) {
    console.error('Error al actualizar la descripción:', error);
    throw error;
  }
};

// Eliminar una descripción
export const deleteDescripcion = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = await fetchWithAuth(`${API_DESCRIPCIONES_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la descripción');
    return await response.json() as ApiResponse<null>;
  } catch (error) {
    console.error('Error al eliminar la descripción:', error);
    throw error;
  }
};
