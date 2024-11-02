import { useAuthStore } from "../store/auth";

// Obtener token de autenticación almacenado en localStorage
export const getToken = (): string | null => {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    return authData.token || null;
  };

// Realizar una petición fetch con el token de autenticación
export const fetchWithAuth = async (url: string, options: RequestInit): Promise<Response> => {
  const authStore = useAuthStore(); // Obtiene el store de autenticación
  const token = authStore.token || getToken(); // Obtiene el token desde el store o localStorage
  
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  const response = await fetch(url, options);

  // Verificar si la respuesta tiene código 403
  if (response.status === 403) {
    // Llama al método logout para limpiar el token
    authStore.logout();
    console.error('Acceso denegado: token inválido o expirado. Se ha cerrado la sesión.');
  }

  return response;
};