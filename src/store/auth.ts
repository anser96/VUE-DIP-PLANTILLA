import { defineStore } from 'pinia';
import { authActions } from './authActions';
import { Usuario } from '../Utils/Interfaces/UsuarioInterface';

export interface AuthState {
  token: string | null;
  user: Usuario | null;
}

// Crear el store con el estado y las acciones
export const useAuthStore = defineStore<'auth', AuthState>('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  actions: {
    ...authActions(), // Desestructurar y agregar las acciones ajustadas
  },
  persist: {
    key: 'token',
    storage: localStorage,
    paths: ['token'], // Persistir solo la propiedad 'token'
  },
});
