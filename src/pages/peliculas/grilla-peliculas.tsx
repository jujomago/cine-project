import { Link } from 'react-router-dom';
import { formatearDuracion } from '@/lib/utils';
import { TemaPublico } from '@/lib/temas-publico';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';

/**
 * Grilla de la pagina /peliculas: una variante por tema (misma logica
 * que la grilla de la home, en ../cine/home/grilla-publico.tsx).
 * Cada tarjeta mantiene el aviso "Inactiva" cuando corresponde.
 */
export function GrillaPeliculas({ peliculas, tema }: { peliculas: Pelicula[]; tema: TemaPublico }) {
    if (tema === 'papel') return <GrillaPapel peliculas={peliculas} />;
    if (tema === 'neon') return <GrillaNeon peliculas={peliculas} />;
    if (tema === 'retro') return <GrillaRetro peliculas={peliculas} />;
    return <GrillaOscuro peliculas={peliculas} />;
}

/** aviso de pelicula inactiva (variante por tema) */
function Inactiva({ tema }: { tema: TemaPublico }) {
    const estilos: Record<TemaPublico, string> = {
        oscuro: 'rounded bg-background/85 px-1.5 py-0.5',
        papel: 'rounded-sm border border-border bg-card px-1.5 py-0.5',
        neon: 'rounded-full border border-border bg-background/85 px-2 py-0.5',
        retro: 'border border-border bg-muted px-1.5 py-0.5',
    };

    return (
        <span className={`absolute top-2 start-2 z-10 text-[10px] font-medium text-muted-foreground ${estilos[tema]}`}>
            Inactiva
        </span>
    );
}

/** oscuro: la original — poster redondeado y titulo en font-mono */
function GrillaOscuro({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula) => {
                const poster = pelicula.imagenes[0];

                return (
                    <article key={pelicula.id} className="group relative">
                        {!pelicula.activo && <Inactiva tema="oscuro" />}

                        <Link to={`/peliculas/${pelicula.id}`}>
                            {/* aspect-[2/3] es la proporcion de un afiche de cine */}
                            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
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
                );
            })}
        </div>
    );
}

/** papel: catalogo impreso — poster con marco fino y titulo serif */
function GrillaPapel({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula) => {
                const poster = pelicula.imagenes[0];

                return (
                    <article key={pelicula.id} className="group relative">
                        {!pelicula.activo && <Inactiva tema="papel" />}

                        <Link to={`/peliculas/${pelicula.id}`}>
                            <div className="border border-border bg-card p-2 shadow-[4px_4px_0_0_var(--muted)]">
                                <div className="aspect-[2/3] overflow-hidden border border-border">
                                    {poster ? (
                                        <img
                                            src={peliculaService.urlImagen(poster)}
                                            alt={pelicula.titulo}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                <h2 className="mt-3 font-display text-base leading-snug text-foreground transition-colors group-hover:text-acento">
                                    {pelicula.titulo}
                                </h2>
                                <p className="mt-1 text-xs italic text-muted-foreground">
                                    {formatearDuracion(pelicula.duracionMinutos)}
                                </p>
                            </div>
                        </Link>
                    </article>
                );
            })}
        </div>
    );
}

/** neon: tarjeta con borde cian y glow en hover */
function GrillaNeon({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula) => {
                const poster = pelicula.imagenes[0];

                return (
                    <article key={pelicula.id} className="group relative">
                        {!pelicula.activo && <Inactiva tema="neon" />}

                        <Link to={`/peliculas/${pelicula.id}`}>
                            {/* el glow en hover esta en temas-publico.css (.tarjeta-neon) */}
                            <div className="tarjeta-neon aspect-[2/3] overflow-hidden rounded-xl border border-acento/25 bg-muted">
                                {poster ? (
                                    <img
                                        src={peliculaService.urlImagen(poster)}
                                        alt={pelicula.titulo}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            <h2 className="mt-3 font-display text-xs font-bold tracking-wider text-foreground uppercase transition-colors group-hover:text-acento">
                                {pelicula.titulo}
                            </h2>
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

/** retro: marco grueso, sombra mostaza e inclinacion alterna */
function GrillaRetro({ peliculas }: { peliculas: Pelicula[] }) {
    return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {peliculas.map((pelicula, i) => {
                const poster = pelicula.imagenes[0];
                // collage: alterna la inclinacion segun la posicion
                const inclinacion = i % 2 === 0 ? '-rotate-1' : 'rotate-1';

                return (
                    <article key={pelicula.id} className="group relative">
                        {!pelicula.activo && <Inactiva tema="retro" />}

                        <Link to={`/peliculas/${pelicula.id}`}>
                            {/* la inclinacion va en el interno: el article puede
                                llevar animacion de entrada y su transform la pisaria */}
                            <div className={`${inclinacion} border-[5px] border-foreground bg-card p-1.5 shadow-[6px_6px_0_0_var(--acento)] transition-shadow duration-300 group-hover:shadow-[9px_9px_0_0_var(--acento)]`}>
                                <div className="aspect-[2/3] overflow-hidden">
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
                                </div>
                            </div>

                            <h2 className="mt-3 font-display text-base leading-tight text-foreground uppercase transition-colors group-hover:text-acento-hover">
                                {pelicula.titulo}
                            </h2>
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
