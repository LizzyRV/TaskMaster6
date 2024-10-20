import axios from 'axios';

// Define la baseURL dependiendo del entorno donde se esté ejecutando
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api/'    // Si estás en localhost (entorno de desarrollo)
  : 'http://backend:8000/api/';     // Si estás en Docker (entorno de producción)

const axios2 = axios.create({
  baseURL: baseURL,  // Aquí se aplica la URL base adecuada dependiendo del entorno
});

// Interceptor para incluir el token de acceso en cada solicitud
axios2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para gestionar el refresh del token si la respuesta es 401 (no autorizado)
axios2.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (token inválido) y no se ha intentado refrescar previamente
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Intenta refrescar el token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No se encontró el token de refresco');
        }

        // Enviar solicitud para refrescar el token
        const response = await axios.post(`${baseURL}auth/token/refresh/`, { refresh: refreshToken });  // Asegúrate de tener el endpoint correcto
        
        // Guardar el nuevo token de acceso en localStorage
        localStorage.setItem('access_token', response.data.access);

        // Añadir el nuevo token a las solicitudes posteriores
        axios2.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        // Reintenta la solicitud original con el nuevo token
        return axios2(originalRequest);
      } catch (refreshError) {
        console.error('No se pudo refrescar el token', refreshError);
        
        // Si no se pudo refrescar el token, redirigir al usuario al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axios2;
