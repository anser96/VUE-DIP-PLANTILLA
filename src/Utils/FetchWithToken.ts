import { useAuthStore } from "../store/auth";

// Obtener token de autenticación almacenado en localStorage
export const getToken = (): string | null => {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    return authData.token || null;
  };

// Realizar una petición fetch con el token de autenticación
// Mapa para rastrear las peticiones en curso y evitar duplicados
const pendingRequests = new Map<string, Promise<Response>>();

// Realizar una petición fetch con el token de autenticación
export const fetchWithAuth = async (url: string, options: RequestInit): Promise<Response> => {
  const authStore = useAuthStore();
  const token = authStore.token || getToken();

  // Si ya hay una petición en curso para la misma URL, retorna esa promesa
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!;
  }

  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  // Crear una promesa para la petición y almacenarla en el mapa
  const fetchPromise = fetch(url, options)
    .then((response) => {
      if (response.status === 403) {
        authStore.logout();
        if (import.meta.env.MODE === 'development') {
          console.warn('Acceso denegado: token inválido o expirado. Se ha cerrado la sesión.');
        } else {
          console.error('Error de autenticación. Cerrando sesión.');
        }
      }
      return response;
    })
    .finally(() => {
      // Eliminar la URL del mapa una vez que la petición ha terminado
      pendingRequests.delete(url);
    });

  // Almacenar la promesa en el mapa antes de ejecutarla
  pendingRequests.set(url, fetchPromise);

  return fetchPromise;
};