import axios from 'axios';
import { env } from "@/config/env";
import { authService } from '@/services/auth.service';

// cliente http 

export const http = axios.create({
    // axios va http://localhost:3000/api/v1/peliculas
    baseURL: env.apiUrl,
    // 30s: las subidas de imagenes (5 archivos) pueden tardar mas de 10s
    timeout: 30000,
});



// request: corre ANTES de que salga la peticion, por eso aqui se pega el token
http.interceptors.request.use((config) => {
    const token = authService.obtenerToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})



// Los errores del backend llegan en dos formas:
// - validacion (ValidationPipe): { message: string[], statusCode } 
// -(HandleException):            { status, message: string, timestamp }
// En ambos el dato util esta en `message`, pero a veces es un arreglo.
function mensajeDeError(data: unknown, fallback: string): string {
    if (!data || typeof data !== 'object') return fallback;
    const { message } = data as { message?: unknown };
    if (typeof message === 'string' && message.trim() !== '') {
        return message;
    }
    if (Array.isArray(message)) {
        const partes = message.filter(
            (m): m is string => typeof m === 'string' && m.trim() !== '',
        );
        if (partes.length > 0) return partes.join(' · ');
    }
    return fallback;
}

http.interceptors.response.use(
    // si sale bien
    (respuesta) => respuesta,
    // si sale mal
    (error) => {
        const status = error.response?.status as number | undefined;
        const url: string = error.config?.url ?? '';

        // 401 = token ausente o vencido: se cierra la sesion y se manda al
        // login conservando en `next` la ruta actual (query incluida) para
        // volver ahi tras iniciar sesion.
        // Excepcion: el login mismo devuelve 401 con credenciales mal,
        // y ahi hay que mostrar el error en el formulario, no recargar la pagina.
        if (status === 401 && !url.includes('/auth/login')) {
            authService.borrarToken();
            const enLogin = window.location.pathname.endsWith('/auth/signin');
            if (!enLogin) {
                const destino = encodeURIComponent(
                    window.location.pathname + window.location.search,
                );
                window.location.assign(`/auth/signin?next=${destino}`);
            }
        }

        // 403 = sesion valida pero el rol no alcanza: usar el mensaje del
        // backend si viene, si no un texto claro en español.
        const fallback =
            status === 403
                ? 'No tienes permiso para esta acción'
                : 'No se puede conectar con el servidor';
        const mensaje = mensajeDeError(error.response?.data, fallback);
        return Promise.reject(new Error(mensaje));
    },
)



