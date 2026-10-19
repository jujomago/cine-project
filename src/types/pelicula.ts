// get
// catalogo de pelicula
export interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  fechaEstreno: string;
  activo: boolean;
  // Solo los nombres del archivo, no las imagenes
  // URL se armando con {apiUrl}/files/pelicula/{nombre}
  imagenes: string[];
}

export interface CrearPelicula {
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  /** Formato YYYY-MM-DD */
  fechaEstreno: string;
  activo: boolean;
}

export interface PeliculaCreada {
  status: string;
  message?: string;
  data: Partial<Pelicula>;
}

// Es generico es un hueco que rrelena al usarlo
// asi la RespuestaPaginada<Pelicula> sirvir para las peliculas

export interface RespuestaPaginada<T> {
  status: string;
  message?: string;
  data: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}
