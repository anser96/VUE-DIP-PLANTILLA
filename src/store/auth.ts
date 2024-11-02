import { defineStore } from 'pinia';
import { Usuario } from '../Utils/Interfaces/UsuarioInterface';
import { LoginData, LoginResponse } from '../Utils/Interfaces/AuthInterface';
import { login as loginService, isTokenValid } from '../services/authService';
import router from '../router';

// Define la interfaz del estado de autenticación
export interface AuthState {
  token: string | null;
  user: Usuario | null;
}

// Crear el store de autenticación
export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),

  actions: {
    async login(data: LoginData): Promise<void> {
      try {
        // Llamar al servicio de login y obtener la respuesta
        const response: LoginResponse = await loginService(data);
        
        // Obtener el token y el usuario de la respuesta
        const token = response.data.token;
        const user = response.data.user || null;

        // Actualizar el estado del store
        this.$patch({
          token,
          user,
        });

        // Guardar el token en localStorage en el formato { "token": "<valor>" }
        localStorage.setItem('auth', JSON.stringify({ token }));

      } catch (error) {
        console.error("Error durante el login:", error);
        throw error;
      }
    },

    logout(): void {
      // Limpiar el estado del store
      this.$patch({
        token: null,
        user: null,
      });

      // Eliminar el token de localStorage
      localStorage.removeItem('auth');
      router.push('/login');
    },

    loadToken(): void {
      // Recuperar y parsear el token almacenado
      const storedData = JSON.parse(localStorage.getItem('auth') || '{}');
      const tokenStored = storedData.token || null;

      // Verificar si el token es válido
      if (tokenStored && isTokenValid(tokenStored)) {
        this.$patch({
          token: tokenStored,
        });
      } else {
        this.logout();
      }
    },

    setToken(token: string): void {
      // Actualizar el estado del store
      this.$patch({
        token,
      });

      // Guardar el token en localStorage en el formato { "token": "<valor>" }
      localStorage.setItem('auth', JSON.stringify({ token }));
    },

    clearToken(): void {
      // Limpiar el estado del store
      this.$patch({
        token: null,
      });

      // Eliminar el token de localStorage
      localStorage.removeItem('auth');
    },
  },

  persist: {
    key: 'auth',
    storage: localStorage,
    pick: ['token'], // Persistir solo la propiedad 'token'
  },
});
