import { Link } from 'react-router-dom';
import { formatearDuracion, formatearFecha } from '@/lib/utils';
import { TemaPublico } from '@/lib/temas-publico';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';

/**
 * Grilla de peliculas de la home: una variante por tema.
 * Todas usan animar-subir con retardo escalonado para la entrada.
 */
export function GrillaPublica({ peliculas, tema }: { peliculas: Pelicula[]; tema: TemaPublico }) {
    if (tema === 'papel') return <GrillaPapel peliculas={peliculas} />;
    if (tema === 'neon') return <GrillaNeon peliculas={peliculas} />;
    if (tema === 'retro') return <GrillaRetro peliculas={peliculas} />;
    return <GrillaOscuro peliculas={peliculas} />;
}

/** oscuro: tarjetas con badge de estreno y sinopsis al hacer hover */
function GrillaOscuro({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula, i) => {
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
                            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-muted">
                                {poster ? (
                                    <img src={peliculaService.urlImagen(poster)}
                                        alt={pelicula.titulo}
                                        // loading lazy: no descarga las imagenes de abajo
                                        // hasta que el usuario llegue a ellas
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                        Sin imagen
                                    </div>
                                )}

                                {/* badge de estreno */}
                                <span className="absolute top-3 left-3 rounded bg-background/85 px-2 py-0.5 text-[11px] font-medium text-acento backdrop-blur-sm">
                                    {formatearFecha(pelicula.fechaEstreno)}
                                </span>

                                {/* hover: revela la sinopsis sobre el poster */}
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <p className="line-clamp-4 text-xs leading-relaxed text-foreground/85">
                                        {pelicula.sinopsis}
                                    </p>
                                    <span className="mt-3 text-xs font-semibold text-acento">
                                        Ver detalles →
                                    </span>
                                </div>
                            </div>

                            <h3 className="mt-3 font-display text-base leading-tight tracking-wide text-foreground uppercase transition-colors group-hover:text-acento-hover">
                                {pelicula.titulo}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {formatearDuracion(pelicula.duracionMinutos)}
                            </p>
                        </Link>
                    </article>
                )
            })}
        </div>
    );
}

/** papel: lista tipo programa impreso — miniatura, titulo serif y filetes */
function GrillaPapel({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <ul className="border-t border-border">
            {peliculas.map((pelicula, i) => {
                const poster = pelicula.imagenes[0];

                return (
                    <li
                        key={pelicula.id}
                        className="animar-subir border-b border-border"
                        style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                    >
                        <Link to={`/peliculas/${pelicula.id}`} className="group flex items-center gap-4 py-4 sm:gap-5">
                            {poster ? (
                                <img
                                    src={peliculaService.urlImagen(poster)}
                                    alt=""
                                    loading="lazy"
                                    className="h-24 w-16 shrink-0 border border-border object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-16 shrink-0 items-center justify-center border border-border text-[10px] text-muted-foreground">
                                    Sin imagen
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-display text-lg leading-snug text-foreground transition-colors group-hover:text-acento">
                                    {pelicula.titulo}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                    {pelicula.sinopsis}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-xs font-medium text-foreground">
                                    {formatearDuracion(pelicula.duracionMinutos)}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatearFecha(pelicula.fechaEstreno)}
                                </p>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

/** neon: tarjetas con borde cian y glow en hover */
function GrillaNeon({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula, i) => {
                const poster = pelicula.imagenes[0];

                return (
                    <article
                        key={pelicula.id}
                        className="animar-subir group"
                        style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
                    >
                        <Link to={`/peliculas/${pelicula.id}`}>
                            {/* el glow en hover va en temas-publico.css (.tarjeta-neon) */}
                            <div className="tarjeta-neon relative aspect-[2/3] overflow-hidden rounded-xl border border-acento/25 bg-card">
                                {poster ? (
                                    <img
                                        src={peliculaService.urlImagen(poster)}
                                        alt={pelicula.titulo}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                        Sin imagen
                                    </div>
                                )}

                                {/* chip de estreno redondeado */}
                                <span className="absolute top-3 left-3 rounded-full border border-acento/50 bg-background/80 px-2 py-0.5 text-[11px] font-medium text-acento backdrop-blur-sm">
                                    {formatearFecha(pelicula.fechaEstreno)}
                                </span>

                                {/* hover: revela la sinopsis */}
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <p className="line-clamp-4 text-xs leading-relaxed text-foreground/85">
                                        {pelicula.sinopsis}
                                    </p>
                                    <span className="mt-3 text-xs font-semibold text-acento">
                                        Ver detalles →
                                    </span>
                                </div>
                            </div>

                            <h3 className="mt-3 font-display text-sm font-bold tracking-wider text-foreground uppercase transition-colors group-hover:text-acento">
                                {pelicula.titulo}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {formatearDuracion(pelicula.duracionMinutos)}
                            </p>
                        </Link>
                    </article>
                );
            })}
        </div>
    );
}

/** retro: marco grueso, sombra mostaza, ligera inclinacion alterna y sinopsis fija */
function GrillaRetro({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula, i) => {
                const poster = pelicula.imagenes[0];
                // collage: las tarjetas pares e impares se inclinan a lados opuestos
                const inclinacion = i % 2 === 0 ? '-rotate-1' : 'rotate-1';

                return (
                    <article
                        key={pelicula.id}
                        className="animar-subir group"
                        style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
                    >
                        <Link to={`/peliculas/${pelicula.id}`}>
                            {/* la inclinacion va en el interno: el externo esta
                                animado y su transform la pisaria */}
                            <div
                                className={`${inclinacion} border-[5px] border-foreground bg-card p-1.5 shadow-[6px_6px_0_0_var(--acento)] transition-shadow duration-300 group-hover:shadow-[9px_9px_0_0_var(--acento)]`}
                            >
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    {poster ? (
                                        <img
                                            src={peliculaService.urlImagen(poster)}
                                            alt={pelicula.titulo}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                            Sin imagen
                                        </div>
                                    )}

                                    {/* badge de estreno tipo sello */}
                                    <span className="absolute top-2 left-2 bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                        {formatearFecha(pelicula.fechaEstreno)}
                                    </span>
                                </div>
                            </div>

                            <h3 className="mt-3 font-display text-base leading-tight text-foreground uppercase transition-colors group-hover:text-acento-hover">
                                {pelicula.titulo}
                            </h3>
                            {/* sinopsis siempre visible (sin overlay de hover) */}
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {pelicula.sinopsis}
                            </p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                {formatearDuracion(pelicula.duracionMinutos)}
                            </p>
                        </Link>
                    </article>
                );
            })}
        </div>
    );
}
