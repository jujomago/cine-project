import { useEffect, useState } from 'react';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Container } from '@/components/common/container';
import { Link, useParams } from 'react-router-dom';
import { Funcion } from '@/types/cartelera';
import { carteleraService } from '@/services/cartelera.service';




export function PeliculasDellatePage() {
    const { id } = useParams<{ id: string }>();
    const idPelicula = Number(id);
    const [pelicula, setPelicula] = useState<Pelicula | undefined>();
    const [funciones, setFunciones] = useState<Funcion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCargando(true);
        Promise.all([
            peliculaService.obtenerPelicula(idPelicula),
            carteleraService.listarFunciones(idPelicula)
        ])
            .then(([peliculaHallada, funcionesHalladas]) => {
                setPelicula(peliculaHallada);
                setFunciones(funcionesHalladas);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false))
    }, [idPelicula])


    if (cargando) {
        return (
            <Container>
                <p>Cargando pelicula....</p>
            </Container>
        )
    }

    if (error) {
        return (
            <Container>
                <p>{error}</p>
            </Container>
        )
    }

    // 
    if (!pelicula) {
        return (
            <Container>
                <p>No se encontro esa pelicula</p>
                <Link to="/peliculas">Volver al listado</Link>
            </Container>
        )
    }


    const poster = pelicula.imagenes[0];
    return (
        <Container>
            <div className="py-8">
                <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr]">
                    <div className="overflow-hidden rounded-lg bg-muted aspect-[2/3]">
                        {poster ? (
                            <img src={peliculaService.urlImagen(poster)} className="h-full w-full object-cover" />

                        ) : (

                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                Sin imagen
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-mono">
                                {pelicula.titulo}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {pelicula.duracionMinutos} min · Estreno{' '}
                                {new Date(pelicula.fechaEstreno).toLocaleDateString('es-BO', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                        <p className="text-sm leading-relaxed text-secondary-foreground">
                            {pelicula.sinopsis}
                        </p>
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-mono">
                                Horarios
                            </h2>

                            {funciones.length === 0 ? (
                                <p>No hay funciones programadas</p>
                            ) : (
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {/* CREACION DE FUNCION COMPLETA */}
                                    {funciones.map((funcion) => (
                                        // Link y no div: toda la tarjeta lleva al mapa de butacas de esa funcion
                                        <Link
                                            key={funcion.idFuncion}
                                            to={`/funciones/${funcion.idFuncion}`}
                                            className='rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary'
                                        >
                                            <p className="text-base font-medium text-mono">
                                               Hora Inicio {funcion.horaInicio.slice(0, 5)}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                               Precio {funcion.precio}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                              Salas  {funcion.sala} - {funcion.tipoSala}
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-mono">
                                            </p>
                                        </Link>

                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
