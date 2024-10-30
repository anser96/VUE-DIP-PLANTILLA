import { LoginData, LoginResponse } from '../Utils/Interfaces/AuthInterface';
import { login as loginService, isTokenValid } from '../services/authService';

// Define las acciones con el tipado adecuado
export function authActions() {
  return {
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

        // Guardar el token en localStorage
        localStorage.setItem('token', token);

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
      localStorage.removeItem('token');
    },

    loadToken(): void {
      const tokenStored = localStorage.getItem('token');

      // Verificar si el token es válido
      if (tokenStored && isTokenValid(tokenStored)) {
        // Actualizar el estado del store
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

      // Guardar el token en localStorage
      localStorage.setItem('token', token);
    },

    clearToken(): void {
      // Limpiar el estado del store
      this.$patch({
        token: null,
      });

      // Eliminar el token de localStorage
      localStorage.removeItem('token');
    },
  };
}
