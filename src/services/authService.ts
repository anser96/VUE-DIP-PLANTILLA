import { LoginData, LoginResponse } from "../Utils/Interfaces/MeetingRecords";

// URL base de la API, usando la variable de entorno
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// Método para iniciar sesión usando fetch
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }

    const json: LoginResponse = await response.json();

    // Verificar el estado de la respuesta
    if (json.status === 'success' && json.data.token) {
      return json; // Retornar la respuesta completa con el token
    } else {
      throw new Error('Error de autenticación: respuesta inválida');
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    throw error;
  }
};

// Método para registrarse
export const register = async (data: LoginData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok || json.status !== 'success') {
      // Lanza un error si el registro falla
      throw new Error(json.message || 'Error en el registro');
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    throw error;
  }
};

// Método para recuperar contraseña
export const forgotPassword = async (correo: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ correo }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error durante la recuperación de contraseña:', error);
    throw error;
  }
};
