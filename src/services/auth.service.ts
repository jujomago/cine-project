import { http } from "@/lib/http";
import { RespuestaLogin, Credenciales, Rol, RolAsignado } from "@/types/auth"


const CLAVE_TOKEN = 'cine_token';
export const authService = {
    async login(credenciales: Credenciales): Promise<string> {
        const {data} = await http.post<RespuestaLogin>('/auth/login', credenciales);
        // console.log('>>respuesta data', data);
        const token = data?.data?.token;
        // console.log('token extraiduo:', token);
        if (!token) { throw new Error ('El servidor no devolvio un token'); }
        return token;
    },

    // guardar el token
    // el token en el navegador
    guardarToken(token: string) {
        // console.log('guardando tokennn');
        try {
            localStorage.setItem(CLAVE_TOKEN, token)
        } catch{
            console.log('No se pudo guardar el token en modo privado');
        }
    },
    obtenerToken(): string | null {
        try {
               return localStorage.getItem(CLAVE_TOKEN);
        } catch {
                return null;
        }
    },
    borrarToken() {
        try {
            localStorage.removeItem(CLAVE_TOKEN)
        } catch  {
            // /no se hace nada/
            //   console.log('No se pudo borrar el token');
        }
    },

    // lista de roles (protegido: ADMIN o GERENTE). El backend lo envuelve
    // como { status, message, data: Rol[] }
    async listarRoles(): Promise<Rol[]> {
        const {data} = await http.get<{ data: Rol[] }>('/auth/roles');
        return data.data;
    },

    // asigna un rol a la persona (solo ADMIN). La persona debe volver a
    // iniciar sesion para recibir un token con el rol nuevo
    async asignarRol(idPersona: number, idRol: number): Promise<RolAsignado> {
        const {data} = await http.post<RolAsignado>('/auth/rol-usuario', {idPersona, idRol});
        return data;
    },
}