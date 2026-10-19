import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { formatearDuracion, formatearFecha } from '@/lib/utils';
import { TemaPublico } from '@/lib/temas-publico';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';

/**
 * Hero de la home publica: una variante por tema (ver temas-publico.css).
 * Los datos son siempre los mismos (pelicula destacada); lo que cambia es
 * la composicion, la tipografia y los adornos de cada tema.
 */
export function HeroePublico({ destacada, tema }: { destacada: Pelicula; tema: TemaPublico }) {
    if (tema === 'papel') return <HeroPapel destacada={destacada} />;
    if (tema === 'neon') return <HeroNeon destacada={destacada} />;
    if (tema === 'retro') return <HeroRetro destacada={destacada} />;
    return <HeroOscuro destacada={destacada} />;
}

/** oscuro: el original, banner a pantalla completa con degradados */
function HeroOscuro({ destacada }: { destacada: Pelicula }) {
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
                    <p className="animar-subir text-xs font-semibold tracking-[0.35em] text-acento uppercase">
                        Ahora en cartelera
                    </p>
                    <h1
                        className="animar-subir mt-4 font-display text-5xl leading-[0.95] tracking-wide text-foreground uppercase md:text-7xl"
                        style={{ animationDelay: '80ms' }}
                    >
                        {destacada.titulo}
                    </h1>
                    <p
                        className="animar-subir mt-4 text-sm text-muted-foreground"
                        style={{ animationDelay: '160ms' }}
                    >
                        {formatearDuracion(destacada.duracionMinutos)}
                        <span className="mx-2 text-muted-foreground">·</span>
                        Estreno {formatearFecha(destacada.fechaEstreno)}
                    </p>
                    <p
                        className="animar-subir mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/80 md:text-base"
                        style={{ animationDelay: '240ms' }}
                    >
                        {destacada.sinopsis}
                    </p>
                    <div className="animar-subir mt-7 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
                        <Link
                            to={`/peliculas/${destacada.id}`}
                            className="rounded-md bg-acento px-6 py-2.5 text-sm font-semibold text-acento-texto transition-colors hover:bg-acento-hover"
                        >
                            Ver detalles
                        </Link>
                        <Link
                            to="/cartelera"
                            className="rounded-md border border-input px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
                        >
                            Ver cartelera
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/** papel: cartel impreso — poster enmarcado + bloque editorial con filetes */
function HeroPapel({ destacada }: { destacada: Pelicula }) {
    const poster = destacada.imagenes[0];

    return (
        <section className="border-b border-border bg-background">
            <Container className="grid items-center gap-10 py-14 md:grid-cols-[280px_1fr] md:gap-14 md:py-20">
                {/* poster enmarcado con sombra de papel */}
                <div className="animar-subir mx-auto w-full max-w-[280px] border border-border bg-card p-3 shadow-[8px_8px_0_0_var(--muted)]">
                    {poster ? (
                        <img
                            src={peliculaService.urlImagen(poster)}
                            alt={destacada.titulo}
                            className="aspect-[2/3] w-full border border-border object-cover"
                        />
                    ) : (
                        <div className="flex aspect-[2/3] items-center justify-center text-xs text-muted-foreground">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* texto tipo programa de cine impreso */}
                <div className="animar-subir text-center md:text-left" style={{ animationDelay: '80ms' }}>
                    <p className="flex items-center gap-4 text-xs font-semibold tracking-[0.3em] text-acento uppercase">
                        <span className="hidden h-px flex-1 bg-acento/40 md:block" aria-hidden="true" />
                        Ahora en cartelera
                        <span className="hidden h-px flex-1 bg-acento/40 md:block" aria-hidden="true" />
                    </p>
                    <h1 className="mt-5 font-display text-4xl leading-tight text-foreground md:text-6xl">
                        {destacada.titulo}
                    </h1>
                    {/* filete doble de imprenta bajo el titulo */}
                    <div className="mt-5 border-t-2 border-b border-foreground/70 py-1" aria-hidden="true" />
                    <p className="mt-4 text-sm italic text-muted-foreground">
                        {formatearDuracion(destacada.duracionMinutos)}
                        <span className="mx-2">·</span>
                        Estreno {formatearFecha(destacada.fechaEstreno)}
                    </p>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/80 md:mx-0 md:text-base">
                        {destacada.sinopsis}
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                        <Link
                            to={`/peliculas/${destacada.id}`}
                            className="rounded-md bg-acento px-6 py-2.5 text-sm font-semibold text-acento-texto transition-colors hover:bg-acento-hover"
                        >
                            Ver detalles
                        </Link>
                        <Link
                            to="/cartelera"
                            className="rounded-md border border-input px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
                        >
                            Ver cartelera
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/** neon: asimetrico — barra de acento, titulo con resplandor y poster en glow */
function HeroNeon({ destacada }: { destacada: Pelicula }) {
    const fondo = destacada.imagenes[1] ?? destacada.imagenes[0];

    return (
        <section className="relative overflow-hidden border-b border-border">
            {/* barra vertical cian→magenta al borde izquierdo */}
            <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-acento via-primary to-transparent"
            />
            <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
                <div className="pl-3 md:pl-5">
                    <p className="animar-subir text-xs font-medium tracking-[0.25em] text-acento uppercase">
                        [ Ahora en cartelera ]
                    </p>
                    <h1
                        className="neon-resplandor animar-subir mt-4 font-display text-4xl leading-[1.05] tracking-wide text-foreground uppercase md:text-6xl"
                        style={{ animationDelay: '80ms' }}
                    >
                        {destacada.titulo}
                    </h1>
                    {/* duracion y estreno como chips */}
                    <div className="animar-subir mt-5 flex flex-wrap gap-2" style={{ animationDelay: '160ms' }}>
                        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                            {formatearDuracion(destacada.duracionMinutos)}
                        </span>
                        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                            Estreno {formatearFecha(destacada.fechaEstreno)}
                        </span>
                    </div>
                    <p
                        className="animar-subir mt-5 line-clamp-3 text-sm leading-relaxed text-foreground/80 md:text-base"
                        style={{ animationDelay: '240ms' }}
                    >
                        {destacada.sinopsis}
                    </p>
                    <div className="animar-subir mt-7 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
                        <Link
                            to={`/peliculas/${destacada.id}`}
                            className="rounded-md bg-acento px-6 py-2.5 text-sm font-semibold text-acento-texto transition-colors hover:bg-acento-hover"
                        >
                            Ver detalles
                        </Link>
                        <Link
                            to="/cartelera"
                            className="rounded-md border border-acento/40 px-6 py-2.5 text-sm font-medium text-acento transition-colors hover:border-acento hover:bg-acento/10"
                        >
                            Ver cartelera
                        </Link>
                    </div>
                </div>

                {/* banner con halo cian */}
                {fondo && (
                    <div
                        className="neon-marco animar-subir relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-acento/30"
                        style={{ animationDelay: '160ms' }}
                    >
                        <img
                            src={peliculaService.urlImagen(fondo)}
                            alt={destacada.titulo}
                            className="aspect-[16/10] w-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                )}
            </Container>
        </section>
    );
}

/** retro: poster inclinado con sombra mostaza, impresion descuadrada y sol */
function HeroRetro({ destacada }: { destacada: Pelicula }) {
    const poster = destacada.imagenes[0];

    return (
        <section className="relative overflow-hidden">
            {/* sol naranja difuso de fondo */}
            <div aria-hidden="true" className="retro-sol absolute inset-0" />
            <Container className="relative grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
                <div>
                    {/* etiqueta tipo etiqueta de vinilo, ligeramente torcida */}
                    <p className="animar-subir inline-block -rotate-1 bg-acento px-3 py-1 text-xs font-bold tracking-[0.2em] text-acento-texto uppercase">
                        Ahora en cartelera
                    </p>
                    <h1
                        className="retro-impresion animar-subir mt-5 font-display text-4xl leading-[1.05] text-foreground uppercase md:text-6xl"
                        style={{ animationDelay: '80ms' }}
                    >
                        {destacada.titulo}
                    </h1>
                    <p className="animar-subir mt-4 text-sm font-medium text-muted-foreground" style={{ animationDelay: '160ms' }}>
                        {formatearDuracion(destacada.duracionMinutos)}
                        <span className="mx-2">·</span>
                        Estreno {formatearFecha(destacada.fechaEstreno)}
                    </p>
                    <p
                        className="animar-subir mt-4 max-w-xl text-sm leading-relaxed text-foreground/80 md:text-base"
                        style={{ animationDelay: '240ms' }}
                    >
                        {destacada.sinopsis}
                    </p>
                    <div className="animar-subir mt-7 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
                        <Link
                            to={`/peliculas/${destacada.id}`}
                            className="rounded-md bg-acento px-6 py-2.5 text-sm font-semibold text-acento-texto transition-colors hover:bg-acento-hover"
                        >
                            Ver detalles
                        </Link>
                        {/* boton tipo boleto, borde punteado */}
                        <Link
                            to="/cartelera"
                            className="rounded-md border-2 border-dashed border-foreground/40 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                        >
                            Ver cartelera
                        </Link>
                    </div>
                </div>

                {/* poster con marco grueso y sombra mostaza; la rotacion va en el
                    interno para no chocar con la animacion de entrada del externo */}
                {poster && (
                    <div className="animar-subir mx-auto w-full max-w-[300px]" style={{ animationDelay: '120ms' }}>
                        <div className="rotate-[-2deg] border-[6px] border-foreground bg-card p-2 shadow-[10px_10px_0_0_var(--acento)]">
                            <img
                                src={peliculaService.urlImagen(poster)}
                                alt={destacada.titulo}
                                className="aspect-[2/3] w-full object-cover"
                            />
                        </div>
                    </div>
                )}
            </Container>
        </section>
    );
}
