// src/services/sesionService.ts

import { fetchWithAuth } from "../Utils/FetchWithToken";
import { Sesion, ApiResponse, LocalTime, Miembro, Invitado, AsistenciaInvitado, AsistenciaMiembro, QuorumEntry } from "../Utils/Interfaces/MeetingRecords";

const API_SESIONES_URL = `${import.meta.env.VITE_API_URL}/sesiones`;
const API_URL = `${import.meta.env.VITE_API_URL}`;

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
export const getSesionById = async (id: number): Promise<ApiResponse<Sesion>> => {
  try {
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error(`Error al obtener la sesión con ID: ${id}`);
    return await response.json() as ApiResponse<Sesion>;
  } catch (error) {
    console.error(`Error al obtener la sesión con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva sesión
export const createSesion = async (sesion: Partial<Sesion>): Promise<ApiResponse<Sesion>> => {
  try {
    const response = await fetchWithAuth(API_SESIONES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sesion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la sesión');
    }

    return await response.json() as ApiResponse<Sesion>;
  } catch (error) {
    console.error('Error al crear la sesión:', error);
    throw error;
  }
};

// Actualizar una sesión existente
export const updateSesion = async (id: number, sesion: Partial<Sesion>): Promise<ApiResponse<Sesion>> => {
  try {
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sesion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar la sesión');
    }

    return await response.json() as ApiResponse<Sesion>;
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

// Formatear miembros para la solicitud
const formatMiembrosForRequest = (miembros: AsistenciaMiembro[]): any[] => {
  return miembros.map(miembro => ({
    id: miembro.idMiembro,
    nombre: miembro.nombre,
    cargo: miembro.cargo,
    email: miembro.email,
  }));
};

// Agregar miembros a la sesión
export const addMiembrosToSesion = async (idSesion: number, miembros: AsistenciaMiembro[]): Promise<ApiResponse<Sesion>> => {
  try {
    const formattedMiembros = formatMiembrosForRequest(miembros);
    const response = await fetchWithAuth(`${API_SESIONES_URL}/${idSesion}/miembros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedMiembros),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al agregar miembros a la sesión');
    }

    const responseData = await response.text();

    // Verificar si la respuesta está vacía para evitar errores de JSON
    if (!responseData) {
      console.warn("Respuesta vacía al agregar miembros.");
      return { status: 'error', message: 'Respuesta vacía del servidor' } as ApiResponse<Sesion>;
    }

    return JSON.parse(responseData) as ApiResponse<Sesion>;
  } catch (error) {
    console.error('Error al agregar miembros a la sesión:', error);
    throw error;
  }
};


// Formatear invitados para la solicitud
const formatInvitadosForRequest = (invitados: AsistenciaInvitado[]): any[] => {
  return invitados.map(invitado => ({
    id: invitado.idInvitado,
    nombre: invitado.nombre,
    dependencia: invitado.dependencia,
    estadoAsistencia: invitado.estadoAsistencia,
    email: invitado.email,
  }));
};

// Agregar invitados a la sesión
export const addInvitadosToSesion = async (idSesion: number, invitados: AsistenciaInvitado[]): Promise<ApiResponse<Sesion>> => {
  try {
    const formattedInvitados = formatInvitadosForRequest(invitados);

    const response = await fetchWithAuth(`${API_SESIONES_URL}/${idSesion}/invitados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedInvitados),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al agregar invitados a la sesión');
    }

    const responseData = await response.text();

    if (!responseData) {
      console.warn("Respuesta vacía al agregar invitados.");
      return { status: 'error', message: 'Respuesta vacía del servidor' } as ApiResponse<Sesion>;
    }

    return JSON.parse(responseData) as ApiResponse<Sesion>;
  } catch (error) {
    console.error('Error al agregar invitados a la sesión:', error);
    throw error;
  }
};

// Obtener lista de invitados
export const fetchExistingGuests = async (): Promise<ApiResponse<Invitado[]>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/invitados`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener la lista de invitados');
    return await response.json() as ApiResponse<Invitado[]>;
  } catch (error) {
    console.error('Error al obtener la lista de invitados:', error);
    throw error;
  }
};

// Obtener lista de miembros
export const fetchExistingMembers = async (): Promise<ApiResponse<Miembro[]>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/miembros`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al obtener la lista de miembros');
    return await response.json() as ApiResponse<Miembro[]>; // Devuelve directamente el array de miembros
  } catch (error) {
    console.error('Error al obtener la lista de miembros:', error);
    throw error;
  }
};


// Crear un nuevo invitado
export const createGuest = async (guest: Partial<Invitado>): Promise<ApiResponse<Invitado>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/invitados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guest),
    });
    if (!response.ok) throw new Error('Error al crear invitado');
    return await response.json() as ApiResponse<Invitado>;
  } catch (error) {
    console.error('Error al crear invitado:', error);
    throw error;
  }
};

// Crear un nuevo miembro
export const createMember = async (member: Partial<Miembro>): Promise<ApiResponse<Miembro>> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/miembros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error('Error al crear miembro');
    return await response.json() as ApiResponse<Miembro>;
  } catch (error) {
    console.error('Error al crear miembro:', error);
    throw error;
  }
};

// Función para verificar el quórum en el servidor
export const verificarQuorumEnServidor = async (idSesion: number, quorumData: any[]): Promise<void> => {
  try {
    const response = await fetchWithAuth(
      `http://localhost:8080/api/sesiones/${idSesion}/verificar-quorum`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quorumData),
      }
    );

    if (!response.ok) {
      throw new Error('Error al verificar el quórum');
    }

    // Intentar parsear la respuesta como JSON, y si falla, leerla como texto
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();  // Leer como texto si no es JSON
    }

    console.log('Respuesta de verificación de quórum:', responseData);
  } catch (error) {
    console.error('Error al verificar el quórum:', error);
    throw error;
  }
};

