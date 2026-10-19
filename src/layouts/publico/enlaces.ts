import { TemaPublico } from '@/lib/temas-publico';

/** Nombre propio de cada enlace según el tema (las rutas no cambian) */
const ETIQUETAS: Record<TemaPublico, { peliculas: string; cartelera: string }> = {
    oscuro: { peliculas: 'Películas', cartelera: 'Cartelera' },
    papel: { peliculas: 'Largometrajes', cartelera: 'Programación' },
    neon: { peliculas: 'Estrenos', cartelera: 'Funciones' },
    retro: { peliculas: 'Ciclos', cartelera: 'Sesiones' },
};

/** Enlaces de navegación de la zona pública (cabecera y pie), con las
 *  etiquetas del tema activo */
export function enlacesPorTema(tema: TemaPublico) {
    const etiquetas = ETIQUETAS[tema];
    return [
        { titulo: etiquetas.peliculas, ruta: '/peliculas' },
        { titulo: etiquetas.cartelera, ruta: '/cartelera' },
    ];
}
