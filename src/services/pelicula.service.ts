import {
  CrearPelicula,
  Pelicula,
  PeliculaCreada,
  RespuestaPaginada,
} from '@/types/pelicula';
import { env } from '@/config/env';
import { http } from '@/lib/http';

export const peliculaService = {
  async listarPeliculas(
    pagina = 1,
    porPagina = 100,
  ): Promise<RespuestaPaginada<Pelicula>> {
    const { data } = await http.get<RespuestaPaginada<Pelicula>>('/peliculas', {
      params: { pagina, porPagina },
    });
    return data;
  },

  // detalles de pelicula
  async obtenerPelicula(id: number): Promise<Pelicula | undefined> {
    const respuesta = await this.listarPeliculas(1, 100);
    return respuesta.data.find((p) => p.id === id);
  },

  // url para porter
  urlImagen(nombreArchivo: string): string {
    return `${env.apiUrl}/files/pelicula/${nombreArchivo}`;
  },

  // registro de pelicula con imagenes (protegido: ADMIN o GERENTE).
  // FormData en vez de JSON porque lleva archivos.
  // OJO: NO se pone Content-Type a mano; axios lo arma solo con el
  // boundary. Si lo fuerzan, las imagenes no llegan al servidor.
  async crear(
    pelicula: CrearPelicula,
    imagenes: File[],
  ): Promise<PeliculaCreada> {
    const datos = new FormData();

    // FormData solo acepta texto: numeros y booleanos van como cadena
    datos.append('titulo', pelicula.titulo);
    datos.append('sinopsis', pelicula.sinopsis);
    datos.append('duracionMinutos', String(pelicula.duracionMinutos));
    datos.append('fechaEstreno', pelicula.fechaEstreno);
    datos.append('activo', String(pelicula.activo));

    // el campo se repite por cada archivo, siempre con el nombre 'imagenes'
    for (const archivo of imagenes) {
      datos.append('imagenes', archivo);
    }

    const { data } = await http.post<PeliculaCreada>('/peliculas', datos);
    return data;
  },
};
