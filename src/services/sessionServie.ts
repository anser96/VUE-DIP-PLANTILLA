// src/services/asistenciaService.ts
import { fetchWithAuth } from "../Utils/FetchWithToken";
import { ApiResponse } from "../Utils/Interfaces/AuthInterface";


const API_URL = `${import.meta.env.VITE_API_URL}/asistencia`;

// Actualizar estado de asistencia de un miembro
export const actualizarEstadoMiembro = async (sesionId: number, miembroId: number, nuevoEstado: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/miembro?sesionId=${sesionId}&miembroId=${miembroId}&nuevoEstado=${nuevoEstado}`, {
      method: 'PUT',
    });
    return await response.json() as ApiResponse<void>;
  } catch (error) {
    console.error("Error al actualizar el estado del miembro:", error);
    throw error;
  }
};

// Actualizar estado de asistencia de un invitado
export const actualizarEstadoInvitado = async (sesionId: number, invitadoId: number, nuevoEstado: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/invitado?sesionId=${sesionId}&invitadoId=${invitadoId}&nuevoEstado=${nuevoEstado}`, {
      method: 'PUT',
    });
    return await response.json() as ApiResponse<void>;
  } catch (error) {
    console.error("Error al actualizar el estado del invitado:", error);
    throw error;
  }
};
