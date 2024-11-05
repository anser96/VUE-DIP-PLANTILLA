import { fetchWithAuth } from "../Utils/FetchWithToken";
import { Acta, ActaDetail, ApiResponse, ApiResponseActa, ApiResponseListActaDTO } from "../Utils/Interfaces/MeetingRecords";

export const API_ACTAS_URL = `${import.meta.env.VITE_API_URL}/actas`;

// Consultar todas las actas
export const getActas = async (): Promise<ApiResponseListActaDTO> => {
  try {
    const response = await fetchWithAuth(API_ACTAS_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener las actas');
    return await response.json() as ApiResponseListActaDTO;
  } catch (error) {
    console.error('Error al obtener las actas:', error);
    throw error;
  }
};

// Función para agregar actas a una sesión
export const addActa = async (idSesion: number, acta: Partial<Acta>): Promise<ApiResponseActa> => {
  try {
    const response = await fetchWithAuth(`${API_ACTAS_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numeroActa: acta.numeroActa,
        estado: acta.estado,
        sesion: { idSesion },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al agregar el acta';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponseActa;
  } catch (error) {
    console.error('Error al agregar el acta:', error);
    throw error;
  }
};

// Consultar un acta por su ID
export const getActaById = async (id: number): Promise<ApiResponse<ActaDetail>> => {
  try {
    const response = await fetchWithAuth(`${API_ACTAS_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener el acta con ID: ${id}`);
    return await response.json() as ApiResponse<ActaDetail>;
  } catch (error) {
    console.error(`Error al obtener el acta con ID ${id}:`, error);
    throw error;
  }
};

export const aprobarActaService = async (actaId: number): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/actas/${actaId}/aprobar`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();  // Procesar la respuesta del error
      throw { response: { data: errorData } }; 
    }

    return await response.json() as ApiResponse<any>;
  } catch (error) {
    console.error('Error en la aprobación del acta:', error);
    throw error;
  }
};
