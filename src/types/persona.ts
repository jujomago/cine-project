import { RespuestaPaginada } from './pelicula';

// Una fila del listado administrativo (GET /persona y GET /persona/buscar).
// documento y telefono llegan como texto aunque parezcan numeros;
// fechaNacimiento es una fecha ISO completa, no "1995-05-20".
// roles y tieneUsuario solo vienen en esos dos listados: si no hay usuario
// no se le puede asignar rol (el backend responde 404).
export interface Persona {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  roles: string[];
  tieneUsuario: boolean;
}

// El sobre paginado es el mismo de peliculas: data, total, pagina, totalPaginas
export type PersonasPaginadas = RespuestaPaginada<Persona>;

export interface CrearPersona {
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  usuario: string;
  constrasena: string;
}

// respuesta
export interface PersonaCreada {
 status:string;
 message?:string;
 data: {
   nombres: string;
   apellidos: string;
   telefono: string;
  },
}