import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { useTemaPublico } from '@/lib/temas-publico';
import { GrillaPeliculas } from './grilla-peliculas';

const OPCIONES_FILTRO = [
    { valor: 'activos', etiqueta: 'Activos' },
    { valor: 'inactivos', etiqueta: 'Inactivos' },
    { valor: 'todos', etiqueta: 'Todos' },
] as const;

type FiltroPeliculas = (typeof OPCIONES_FILTRO)[number]['valor'];

const MENSAJE_VACIO: Record<FiltroPeliculas, string> = {
    activos: 'No hay películas activas',
    inactivos: 'No hay películas inactivas',
    todos: 'No hay películas en la cartelera',
};

/** La grilla cambia de forma segun el tema activo (grilla-peliculas.tsx) */
export function PeliculasPage() {
    const tema = useTemaPublico();
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // por defecto solo se muestran las activas
    const [filtro, setFiltro] = useState<FiltroPeliculas>('activos');


    useEffect(() => {
        peliculaService.listarPeliculas()
            .then((respuesta) => setPeliculas(respuesta.data))
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [])

    if (cargando) {
        return (
            <Container>
                <CargandoCentrado />
            </Container>
        )
    }

    if (error) {
        return (
            <Container>
                <ErrorCarga mensaje={error} />
            </Container>
        )
    }

    // el filtro se aplica en cliente: el listado ya trae el campo activo
    const visibles = peliculas.filter((pelicula) =>
        filtro === 'todos' ? true : filtro === 'activos' ? pelicula.activo : !pelicula.activo,
    );

    return (
        <Container>
            <Helmet>
                <title>Cine – Películas</title>
            </Helmet>
            <div className='space-y-6 py-8'>

                {/* el encabezado queda siempre a la vista: si no, al filtrar
                    a una lista vacia se pierden los botones de filtro */}
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    {/* font-display: titulos con la fuente del tema activo */}
                    <h1 className='font-display text-2xl tracking-wider uppercase'>Películas</h1>

                    {/* filtro activas/inactivas: solo cambia lo que se pinta */}
                    <div className='flex gap-2'>
                        {OPCIONES_FILTRO.map((opcion) => (
                            <Button
                                key={opcion.valor}
                                size='sm'
                                variant={filtro === opcion.valor ? 'primary' : 'outline'}
                                onClick={() => setFiltro(opcion.valor)}
                            >
                                {opcion.etiqueta}
                            </Button>
                        ))}
                    </div>
                </div>

                {visibles.length === 0 ? (
                    <p>{MENSAJE_VACIO[filtro]}</p>
                ) : (
                    <GrillaPeliculas peliculas={visibles} tema={tema} />
                )}
            </div>
        </Container>
    );
}
