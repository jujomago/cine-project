import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { formatearDuracion } from '@/lib/utils';
import { Link } from 'react-router-dom';

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

export function PeliculasPage() {
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
                    <h1>Pelicula</h1>

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
                    <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
                        {visibles.map((pelicula) => {
                        const poster = pelicula.imagenes[0];

                        return (
                            <article key={pelicula.id} className="group relative">

                                {/* aviso visual de que la pelicula no esta activa */}
                                {!pelicula.activo && (
                                    <span className='absolute start-2 top-2 z-10 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'>
                                        Inactiva
                                    </span>
                                )}

                                {/* Link para darle click */}
                                <Link to={`/peliculas/${pelicula.id}`}>
                                    {/* aspect-[2/3] es la proporcion de un afiche de cine */}
                                    <div className="overflow-hidden rounded-lg bg-muted aspect-[2/3]">
                                        {poster ? (
                                            <img src={peliculaService.urlImagen(poster)}
                                                alt={pelicula.titulo}
                                                // loading lazy: no descarga las imagenes de abajo
                                                // hasta que el usuario llegue a ellas
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                                Sin imagen
                                            </div>
                                        )}



                                    </div>

                                    <h2 className="mt-3 text-sm font-medium leading-tight text-mono">
                                        {pelicula.titulo}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatearDuracion(pelicula.duracionMinutos)}
                                    </p>
                                </Link>

                            </article>

                        )
                    })}


                    </div>
                )}
            </div>
        </Container>
    );
}
