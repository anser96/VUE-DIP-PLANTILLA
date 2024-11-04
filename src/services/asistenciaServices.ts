// src/services/asistenciaService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";
import { AsistenciaMiembro, AsistenciaInvitado, ApiResponseVoid, ApiResponse } from "../Utils/Interfaces/MeetingRecords";

const API_ASISTENCIA_URL = `${import.meta.env.VITE_API_URL}/asistencia`;

// Actualizar el estado de asistencia de un miembro
export const updateEstadoAsistenciaMiembro = async (
  sesionId: number,
  miembroId: number,
  nuevoEstado: string
): Promise<ApiResponseVoid> => {
  try {
    const response = await fetchWithAuth(`${API_ASISTENCIA_URL}/miembro`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sesionId, miembroId, nuevoEstado }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar el estado de asistencia del miembro';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponseVoid;
  } catch (error) {
    console.error('Error al actualizar el estado de asistencia del miembro:', error);
    throw error;
  }
};

// Actualizar el estado de asistencia de un invitado
export const updateEstadoAsistenciaInvitado = async (
  sesionId: number,
  invitadoId: number,
  nuevoEstado: string
): Promise<ApiResponseVoid> => {
  try {
    const response = await fetchWithAuth(`${API_ASISTENCIA_URL}/invitado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sesionId, invitadoId, nuevoEstado }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar el estado de asistencia del invitado';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponseVoid;
  } catch (error) {
    console.error('Error al actualizar el estado de asistencia del invitado:', error);
    throw error;
  }
};

// Agregar asistencia de miembros a una sesión
export const addAsistenciaMiembros = async (sesionId: number, miembros: AsistenciaMiembro[]): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${API_ASISTENCIA_URL}/miembros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(miembros),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al agregar asistencia de miembros';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<any>;
  } catch (error) {
    console.error('Error al agregar asistencia de miembros:', error);
    throw error;
  }
};

// Agregar asistencia de invitados a una sesión
export const addAsistenciaInvitados = async (sesionId: number, invitados: AsistenciaInvitado[]): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${API_ASISTENCIA_URL}/invitados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invitados),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al agregar asistencia de invitados';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<any>;
  } catch (error) {
    console.error('Error al agregar asistencia de invitados:', error);
    throw error;
  }
};
