
export interface Credenciales {
    usuario: string;
    contrasena: string;
}

export interface RespuestaLogin {
  status: string;
  message?: string;
  data: { 
    token: string
  };
}

export interface PayloadToken {
        id: number;
        usuario: string;
        roles:string[];
        iat: number;
        exp: number;
}

// no viene de ningun lado 
export interface UsuarioSesion {
    id: number;
    usuario: string;
    roles: string[];
}

// GET /auth/roles (ADMIN o GERENTE)
export interface Rol {
    id: number;
    rol: string;
}

// POST /auth/rol-usuario (ADMIN): devuelve la asignacion creada
export interface RolAsignado {
    status: string;
    message?: string;
    data: {
        id?: number;
        idUsuario?: number;
        idRol?: number;
    };
}