// src/services/solicitudService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";
import { Solicitud ,ApiResponse} from "../Utils/Interfaces/MeetingRecords";

const API_SOLICITUDES_URL = `${import.meta.env.VITE_API_URL}/solicitudes`;

// Obtener todas las solicitudes
export const getSolicitudes = async (): Promise<ApiResponse<Solicitud[]>> => {
  try {
    const response = await fetchWithAuth(API_SOLICITUDES_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener las solicitudes');
    return await response.json() as ApiResponse<Solicitud[]>;
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
    throw error;
  }
};

// Obtener una solicitud por ID
export const getSolicitudById = async (id: number): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(`${API_SOLICITUDES_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener la solicitud con ID: ${id}`);
    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error(`Error al obtener la solicitud con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva solicitud
export const createSolicitud = async (solicitud: Partial<Solicitud>): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(API_SOLICITUDES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solicitud),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al crear la solicitud';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    throw error;
  }
};

// Actualizar una solicitud existente
export const updateSolicitud = async (id: number, solicitud: Partial<Solicitud>): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(`${API_SOLICITUDES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solicitud),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al actualizar la solicitud';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    throw error;
  }
};

// Responder una solicitud
export const responderSolicitud = async (id: number, respuesta: string): Promise<ApiResponse<Solicitud>> => {
  try {
    const response = await fetchWithAuth(`${API_SOLICITUDES_URL}/${id}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuesta }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al responder la solicitud';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Solicitud>;
  } catch (error) {
    console.error('Error al responder la solicitud:', error);
    throw error;
  }
};

// Eliminar una solicitud
export const deleteSolicitud = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const response = await fetchWithAuth(`${API_SOLICITUDES_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la solicitud');
    return await response.json() as ApiResponse<null>;
  } catch (error) {
    console.error('Error al eliminar la solicitud:', error);
    throw error;
  }
};
