import { defineStore } from 'pinia';
import router from '../router';
import { LoginData, LoginResponse, Usuario } from '../Utils/Interfaces/MeetingRecords';
import { login } from '../services/authService';

// Define la interfaz del estado de autenticación
export interface AuthState {
  token: string | null;
  usuario: Usuario | null;
}

// Crear el store de autenticación
export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    usuario: null,
  }),

  actions: {
    async login(data: LoginData): Promise<void> {
      try {
        // Llamar al servicio de login y obtener la respuesta
        const response: LoginResponse = await login(data);
        
        // Obtener el token y el usuario de la respuesta
        const token = response.data.token;
        const usuario = response.data.usuario || null;
        console.log("Usuario:", response);
        // Actualizar el estado del store
        this.$patch({
          token,
          usuario,
        });

        // Guardar el token en localStorage en el formato { "token": "<valor>" }
        localStorage.setItem('auth', JSON.stringify({ token, usuario }));

      } catch (error) {
        console.error("Error durante el login:", error);
        throw error;
      }
    },

    logout(): void {
      // Limpiar el estado del store
      this.$patch({
        token: null,
        usuario: null,
      });

      // Eliminar el token de localStorage
      localStorage.removeItem('auth');
      router.push('/login');
    },

    loadToken(): void {
      // Recuperar y parsear el token almacenado
      const storedData = JSON.parse(localStorage.getItem('auth') || '{}');
      const tokenStored = storedData.token || null;
      const userStored = storedData.usuario || null;

      // Verificar si el token es válido
      if (tokenStored ) {
        this.$patch({
          token: tokenStored,
          usuario: userStored,
        });
      } else {
        this.logout();
      }
    },

    setAuth(token: string, usuario:Usuario): void {
      // Actualizar el estado del store
      this.$patch({
        token,
        usuario
      });

      // Guardar el token en localStorage en el formato { "token": "<valor>" }
      localStorage.setItem('auth', JSON.stringify({ token,usuario }));
    },

    clearToken(): void {
      // Limpiar el estado del store
      this.$patch({
        token: null,
        usuario: null,
      });

      // Eliminar el token de localStorage
      localStorage.removeItem('auth');
    },
  },

  persist: {
    key: 'auth',
    storage: localStorage,
    pick: ['token','usuario'],
  },
});
