import { ApiResponse } from "../Utils/Interfaces/AuthInterface";

// src/services/sessionService.ts
const API_URL = `${import.meta.env.VITE_API_URL}/sesiones`;
const API_ACTAS_URL = `${import.meta.env.VITE_API_URL}/actas`;

export interface Session {
  idSesion?: number;
  lugar: string;
  fecha: string;
  horaInicio: string;
  horaFinal: string;
  contenido: string | null;
  presidente: string | null;
  secretario: string | null;
  asistenciaMiembros: any | null;
  asistenciaInvitados: any | null;
}

// Obtener token almacenado en localStorage desde la clave 'auth'
const getToken = (): string | null => {
  const authData = JSON.parse(localStorage.getItem('auth') || '{}');
  return authData.token || null;
};

// Función para enviar solicitudes autenticadas con token
const fetchWithAuth = async (url: string, options: RequestInit): Promise<Response> => {
  const token = getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return fetch(url, options);
};
// Obtener todas las sesiones
export const getSessions = async (): Promise<ApiResponse<Session[]>> => {
  try {
    const response = await fetchWithAuth(API_URL, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener las sesiones');
    return await response.json() as ApiResponse<Session[]>;
  } catch (error) {
    console.error('Error al obtener las sesiones:', error);
    throw error;
  }
};

// Crear una nueva sesión
export const createSession = async (session: Session): Promise<ApiResponse<Session>> => {
  try {
    const response = await fetchWithAuth(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al crear la sesión';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<Session>;
  } catch (error) {
    console.error('Error al crear la sesión:', error);
    throw error;
  }
};

// Actualizar una sesión existente
export const updateSession = async (id: number, session: Session): Promise<ApiResponse<Session>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });

    if (!response.ok) throw new Error('Error al actualizar la sesión');
    return await response.json() as ApiResponse<Session>;
  } catch (error) {
    console.error('Error al actualizar la sesión:', error);
    throw error;
  }
};

// Obtener una sesión por ID
export const getSessionById = async (id: number): Promise<ApiResponse<Session>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener la sesión');
    return await response.json() as ApiResponse<Session>;
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    throw error;
  }
};

// Eliminar una sesión
export const deleteSession = async (idSession: number): Promise<ApiResponse<null>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${idSession}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la sesión');
    return await response.json() as ApiResponse<null>;
  } catch (error) {
    console.error('Error al eliminar la sesión:', error);
    throw error;
  }
};
export const definirContenidoSesion = async (idSesion: number, contenido: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${idSesion}/definir-contenido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`, // Agrega el token si es necesario
      },
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

// Función para agregar actas a una sesión
export const addActas = async (idSesion: number, acta: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${API_ACTAS_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: acta.estado,
        sesion: { idSesion },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const backendMessage = errorData.message || 'Error al agregar el acta';
      throw new Error(backendMessage);
    }

    return await response.json() as ApiResponse<any>;
  } catch (error) {
    console.error('Error al agregar el acta:', error);
    throw error;
  }
};
// Función para agregar asistencia de miembros a una sesión
export const addAsistenciaMiembros = async (idSesion: number, miembros: Array<any>): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${idSesion}/miembros`, {
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
// Función para agregar asistencia de invitados a una sesión
export const addAsistenciaInvitados = async (idSesion: number, invitados: Array<any>): Promise<ApiResponse<any>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${idSesion}/invitados`, {
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
