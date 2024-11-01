import { Usuario } from './UsuarioInterface';

// Nueva interfaz para la respuesta de login
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user?: Usuario; // Ajusta esto si el usuario también se devuelve en la respuesta
  };
}

// Mantener la interfaz para los datos de login
export interface LoginData {
  correo: string;
  contrasena: string;
}
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
