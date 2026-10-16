import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';

function formatearDuracion(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return horas > 0 ? `${horas}h ${resto}m` : `${resto}m`
}

/**
 * Home publico del cine.
 *
 * Lo primero que ve el visitante: el nombre del cine y la cartelera.
 * No exige sesion: las peliculas y el detalle son publicos.
 */
export function CineHomePage() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        peliculaService.listarPeliculas()
            .then((respuesta) => setPeliculas(respuesta.data))
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [])

    return (
        <>
            {/* ── Titular con el nombre del cine ── */}
            <section className="border-b border-border">
                <Container className="py-16 text-center">
                    <h1 className="text-4xl font-semibold tracking-tight text-mono">
                        CINE
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Peliculas en cartelera, horarios y reservas de butacas
                    </p>
                </Container>
            </section>

            {/* ── Cartelera ── */}
            <Container>
                <div className="space-y-6 py-8">

                    {cargando && <p>Cargando pelicula....</p>}

                    {error && <p>{error}</p>}

                    {!cargando && !error && peliculas.length === 0 && (
                        <p>No hay peliculas en la cartelera</p>
                    )}

                    {!cargando && !error && peliculas.length > 0 && (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                            {peliculas.map((pelicula) => {
                                const poster = pelicula.imagenes[0];

                                return (
                                    <article key={pelicula.id} className="group">

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
        </>
    );
}
