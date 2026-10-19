import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { formatearDuracion, formatearFecha } from '@/lib/utils';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';

/**
 * Home publico del cine.
 *
 * Estetica "sala oscura": fondo negro, acentos ambar (luz de proyector)
 * y tipografia display (Anton) para los titulares.
 *
 * La pelicula mas reciente de la cartelera se muestra como destacada
 * en el hero; el resto forma la grilla con sinopsis al hacer hover.
 */
export function CineHomePage() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        peliculaService.listarPeliculas()
            .then((respuesta) => {
                // solo las peliculas activas forman parte del home
                const activas = respuesta.data.filter((pelicula) => pelicula.activo);
                setPeliculas(activas);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [])

    // la mas reciente por fecha de estreno encabeza el hero
    const destacada = [...peliculas].sort(
        (a, b) => new Date(b.fechaEstreno).getTime() - new Date(a.fechaEstreno).getTime(),
    )[0];
    const resto = peliculas.filter((p) => p.id !== destacada?.id);

    return (
        <>
            {/* ── Hero: pelicula destacada sobre su propia imagen ── */}
            {destacada && (() => {
                // si hay varias imagenes, la segunda suele ser el banner
                const fondo = destacada.imagenes[1] ?? destacada.imagenes[0];

                return (
                    <section className="relative isolate overflow-hidden">
                        {fondo && (
                            <>
                                <img
                                    src={peliculaService.urlImagen(fondo)}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 h-full w-full object-cover object-top opacity-45"
                                />
                                {/* degradado: el texto se lee bien en cualquier parte de la foto */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
                            </>
                        )}

                        <Container className="relative py-20 md:py-28">
                            <div className="max-w-2xl">
                                <p className="animar-subir text-xs font-semibold tracking-[0.35em] text-amber-400 uppercase">
                                    Ahora en cartelera
                                </p>
                                <h1
                                    className="animar-subir mt-4 font-display text-5xl leading-[0.95] tracking-wide text-white uppercase md:text-7xl"
                                    style={{ animationDelay: '80ms' }}
                                >
                                    {destacada.titulo}
                                </h1>
                                <p
                                    className="animar-subir mt-4 text-sm text-zinc-400"
                                    style={{ animationDelay: '160ms' }}
                                >
                                    {formatearDuracion(destacada.duracionMinutos)}
                                    <span className="mx-2 text-zinc-600">·</span>
                                    Estreno {formatearFecha(destacada.fechaEstreno)}
                                </p>
                                <p
                                    className="animar-subir mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-300 md:text-base"
                                    style={{ animationDelay: '240ms' }}
                                >
                                    {destacada.sinopsis}
                                </p>
                                <div className="animar-subir mt-7 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
                                    <Link
                                        to={`/peliculas/${destacada.id}`}
                                        className="rounded-md bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
                                    >
                                        Ver detalles
                                    </Link>
                                    <Link
                                        to="/cartelera"
                                        className="rounded-md border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
                                    >
                                        Ver cartelera
                                    </Link>
                                </div>
                            </div>
                        </Container>
                    </section>
                );
            })()}

            {/* ── Franja de pelicula: separador tematico ── */}
            <div className="film-strip" aria-hidden="true" />

            {/* ── Cartelera completa ── */}
            <Container>
                <div className="space-y-8 py-14">

                    {cargando && <CargandoCentrado />}

                    {error && <ErrorCarga mensaje={error} />}

                    {!cargando && !error && peliculas.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="font-display text-2xl tracking-wide text-zinc-500 uppercase">
                                Sin funciones por ahora
                            </p>
                            <p className="mt-2 text-sm text-zinc-600">
                                Vuelve pronto: la cartelera se renueva cada semana.
                            </p>
                        </div>
                    )}

                    {!cargando && !error && resto.length > 0 && (
                        <>
                            <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
                                <h2 className="font-display text-2xl tracking-wider text-white uppercase md:text-3xl">
                                    Cartelera
                                </h2>
                                <span className="text-xs text-zinc-500">
                                    {resto.length} {resto.length === 1 ? 'pelicula' : 'peliculas'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                                {resto.map((pelicula, i) => {
                                    const poster = pelicula.imagenes[0];

                                    return (
                                        <article
                                            key={pelicula.id}
                                            className="animar-subir group"
                                            // entrada escalonada: cada tarjeta sube 60ms despues de la anterior
                                            style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
                                        >
                                            <Link to={`/peliculas/${pelicula.id}`}>
                                                {/* aspect-[2/3] es la proporcion de un afiche de cine */}
                                                <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 aspect-[2/3]">
                                                    {poster ? (
                                                        <img src={peliculaService.urlImagen(poster)}
                                                            alt={pelicula.titulo}
                                                            // loading lazy: no descarga las imagenes de abajo
                                                            // hasta que el usuario llegue a ellas
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center p-4 text-center text-xs text-zinc-600">
                                                            Sin imagen
                                                        </div>
                                                    )}

                                                    {/* badge de estreno */}
                                                    <span className="absolute top-3 left-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-amber-400 backdrop-blur-sm">
                                                        {formatearFecha(pelicula.fechaEstreno)}
                                                    </span>

                                                    {/* hover: revela la sinopsis sobre el poster */}
                                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        <p className="line-clamp-4 text-xs leading-relaxed text-zinc-300">
                                                            {pelicula.sinopsis}
                                                        </p>
                                                        <span className="mt-3 text-xs font-semibold text-amber-400">
                                                            Ver detalles →
                                                        </span>
                                                    </div>
                                                </div>

                                                <h3 className="mt-3 font-display text-base leading-tight tracking-wide text-white uppercase transition-colors group-hover:text-amber-300">
                                                    {pelicula.titulo}
                                                </h3>
                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {formatearDuracion(pelicula.duracionMinutos)}
                                                </p>
                                            </Link>
                                        </article>
                                    )
                                })}
                            </div>
                        </>
                    )}

                </div>
            </Container>
        </>
    );
}
