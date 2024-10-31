// src/services/sessionService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sesiones';

const API_ACTAS_URL = 'http://localhost:8080/api/actas';

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
  
  export const getSessions = async (): Promise<Session[]> => {
    try {
      const response = await axios.get(API_URL);
      return response.data; // Retorna los datos obtenidos del API
    } catch (error) {
      throw new Error('Error al obtener las sesiones');
    }
  };

// Función para crear una nueva sesión
export const createSession = async (session: Session): Promise<Session> => {
    try {
        const response = await axios.post(API_URL, session);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          // Captura el mensaje específico del backend
          console.log(error.response)
          const backendMessage = error.response.data?.message || 'Error al crear la sesión';
          throw new Error(backendMessage);
        } else {
          throw new Error('Error inesperado al crear la sesión');
        }
      }
  };
  
  export const updateSession = async (id: number, session: Session): Promise<Session> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, session);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar la sesión');
    }
  };
  
  export const getSessionById = async (id: number): Promise<Session> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la sesión');
    }
  };

  export const deleteSession = async (idSession: number) => {
    try {
      const response = await axios.delete(`${API_URL}/${idSession}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  };

  // Función para agregar asistencia de miembros a una sesión
export const addAsistenciaMiembros = async (idSesion: number, miembros: Array<any>): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/${idSesion}/miembros`, miembros);
      return response.data;
    } catch (error) {
      throw new Error('Error al agregar asistencia de miembros');
    }
  };
  
  // Función para agregar asistencia de invitados a una sesión
  export const addAsistenciaInvitados = async (idSesion: number, invitados: Array<any>): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/${idSesion}/invitados`, invitados);
      return response.data;
    } catch (error) {
      throw new Error('Error al agregar asistencia de invitados');
    }
  };
  
  // Función para agregar actas a una sesión
  export const addActas = async (idSesion: number, acta: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_ACTAS_URL}`, {
        estado: acta.estado,
        sesion: { idSesion },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al agregar el acta');
    }
  };

  export const definirContenidoSesion = async (idSesion: number, contenido: string): Promise<void> => {
    try {
      await axios.post(`http://localhost:8080/api/sesiones/${idSesion}/definir-contenido`, {
        contenido,
      });
    } catch (error) {
      throw new Error('Error al definir el contenido de la sesión');
    }
  };
