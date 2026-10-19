import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatearDuracion, formatearFechaCorta, formatearHora, formatearPrecio } from '@/lib/utils';
import { TemaPublico } from '@/lib/temas-publico';
import { peliculaService } from '@/services/pelicula.service';
import { Funcion } from '@/types/cartelera';
import { Pelicula } from '@/types/pelicula';

export interface GrupoPelicula {
    pelicula?: Pelicula;
    funciones: Funcion[];
}

/**
 * Tarjetas de /cartelera: una variante por tema.
 * La logica de agrupacion (una tarjeta por pelicula con sus horarios)
 * vive en cartelera-page.tsx; aqui solo cambia la forma y los estilos.
 */
export function TarjetasCartelera({ grupos, tema }: { grupos: GrupoPelicula[]; tema: TemaPublico }) {
    if (tema === 'papel') return <TarjetasPapel grupos={grupos} />;
    if (tema === 'neon') return <TarjetasNeon grupos={grupos} />;
    if (tema === 'retro') return <TarjetasRetro grupos={grupos} />;
    return <TarjetasOscuro grupos={grupos} />;
}

/** forma de los chips de horario, que cada tema redefine */
interface ChipClases {
    activo: string;
    cancelado: string;
}

/** los chips de horario: el foco de cada tarjeta (hora + fecha/sala) */
function ChipsHorario({ funciones, clases }: { funciones: Funcion[]; clases: ChipClases }) {
    return (
        <div className="mt-3 rounded-lg bg-muted/60 p-2">
            <p className="mb-1.5 flex items-center gap-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                <Clock className="size-3" />
                Horarios ({funciones.length})
            </p>

            <div className="flex flex-wrap gap-1.5">
                {funciones.map((funcion) => {
                    const cancelada = funcion.estado.toUpperCase() === 'CANCELADA';
                    const hora = formatearHora(funcion.horaInicio);
                    const fecha = formatearFechaCorta(funcion.fecha);

                    if (cancelada) {
                        return (
                            <span
                                key={funcion.idFuncion}
                                title="Función cancelada"
                                className={`px-2 py-1 text-center text-xs leading-tight text-muted-foreground line-through opacity-60 ${clases.cancelado}`}
                            >
                                {hora}
                                <span className="block text-[10px]">{fecha}</span>
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={funcion.idFuncion}
                            to={`/funciones/${funcion.idFuncion}`}
                            title={`${fecha} · ${hora} · ${funcion.sala} · ${formatearPrecio(funcion.precio)}`}
                            className={`px-2.5 py-1 text-center text-xs leading-tight transition-colors ${clases.activo}`}
                        >
                            <span className="font-semibold">{hora}</span>
                            <span className="block text-[10px] opacity-80">
                                {fecha} · {funcion.sala}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

/** poster pequeno solo para reconocer la pelicula (comun a las 4 variantes) */
function PosterMini({ id, titulo, poster, extra }: { id: number; titulo: string; poster?: string; extra?: string }) {
    return (
        <Link to={`/peliculas/${id}`} className={`w-24 shrink-0 self-start ${extra ?? ''}`}>
            {/* aspect-[2/3] es la proporcion de un afiche de cine */}
            <div className="aspect-[2/3] overflow-hidden bg-muted">
                {poster ? (
                    <img
                        src={peliculaService.urlImagen(poster)}
                        alt={titulo}
                        // loading lazy: no descarga las imagenes de abajo
                        // hasta que el usuario llegue a ellas
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
                        Sin imagen
                    </div>
                )}
            </div>
        </Link>
    );
}

/** oscuro: la original — tarjeta redondeada con borde y chips azules */
function TarjetasOscuro({ grupos }: { grupos: GrupoPelicula[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo) => {
                const titulo = grupo.pelicula?.titulo ?? grupo.funciones[0].pelicula;
                const poster = grupo.pelicula?.imagenes[0];

                return (
                    <article key={grupo.funciones[0].idPelicula} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                        <PosterMini id={grupo.funciones[0].idPelicula} titulo={titulo} poster={poster} />

                        <div className="min-w-0 flex-1">
                            <Link to={`/peliculas/${grupo.funciones[0].idPelicula}`}>
                                <h2 className="truncate text-sm font-medium leading-tight text-mono" title={titulo}>
                                    {titulo}
                                </h2>
                                {grupo.pelicula && (
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {formatearDuracion(grupo.pelicula.duracionMinutos)}
                                    </p>
                                )}
                            </Link>

                            <ChipsHorario
                                funciones={grupo.funciones}
                                clases={{
                                    activo: 'rounded-md border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground',
                                    cancelado: 'rounded-md border border-border',
                                }}
                            />
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

/** papel: programa impreso — esquinas rectas, titulo serif, chips tipo boleto */
function TarjetasPapel({ grupos }: { grupos: GrupoPelicula[] }) {
    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo) => {
                const titulo = grupo.pelicula?.titulo ?? grupo.funciones[0].pelicula;
                const poster = grupo.pelicula?.imagenes[0];

                return (
                    <article key={grupo.funciones[0].idPelicula} className="flex gap-3 border border-border bg-card p-3 shadow-[4px_4px_0_0_var(--muted)]">
                        <PosterMini id={grupo.funciones[0].idPelicula} titulo={titulo} poster={poster} extra="border border-border" />

                        <div className="min-w-0 flex-1">
                            <Link to={`/peliculas/${grupo.funciones[0].idPelicula}`}>
                                <h2 className="truncate font-display text-base leading-snug text-foreground" title={titulo}>
                                    {titulo}
                                </h2>
                                {grupo.pelicula && (
                                    <p className="mt-0.5 text-xs italic text-muted-foreground">
                                        {formatearDuracion(grupo.pelicula.duracionMinutos)}
                                    </p>
                                )}
                            </Link>

                            <ChipsHorario
                                funciones={grupo.funciones}
                                clases={{
                                    // borde punteado tipo talon de entrada
                                    activo: 'rounded-none border border-dashed border-primary/60 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground',
                                    cancelado: 'rounded-none border border-dashed border-border',
                                }}
                            />
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

/** neon: tarjeta oscura con borde y glow cian, chips redondeados */
function TarjetasNeon({ grupos }: { grupos: GrupoPelicula[] }) {
    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo) => {
                const titulo = grupo.pelicula?.titulo ?? grupo.funciones[0].pelicula;
                const poster = grupo.pelicula?.imagenes[0];

                return (
                    // el glow en hover esta en temas-publico.css (.tarjeta-neon)
                    <article key={grupo.funciones[0].idPelicula} className="tarjeta-neon group flex gap-3 rounded-xl border border-acento/25 bg-card p-3">
                        <PosterMini id={grupo.funciones[0].idPelicula} titulo={titulo} poster={poster} extra="rounded-lg" />

                        <div className="min-w-0 flex-1">
                            <Link to={`/peliculas/${grupo.funciones[0].idPelicula}`}>
                                <h2 className="truncate font-display text-sm font-bold tracking-wider text-foreground uppercase" title={titulo}>
                                    {titulo}
                                </h2>
                                {grupo.pelicula && (
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {formatearDuracion(grupo.pelicula.duracionMinutos)}
                                    </p>
                                )}
                            </Link>

                            <ChipsHorario
                                funciones={grupo.funciones}
                                clases={{
                                    activo: 'rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground',
                                    cancelado: 'rounded-full border border-border',
                                }}
                            />
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

/** retro: marco grueso con sombra mostaza y chips cuadrados */
function TarjetasRetro({ grupos }: { grupos: GrupoPelicula[] }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo) => {
                const titulo = grupo.pelicula?.titulo ?? grupo.funciones[0].pelicula;
                const poster = grupo.pelicula?.imagenes[0];

                return (
                    <article key={grupo.funciones[0].idPelicula} className="flex gap-3 border-[5px] border-foreground bg-card p-3 shadow-[6px_6px_0_0_var(--acento)]">
                        <PosterMini id={grupo.funciones[0].idPelicula} titulo={titulo} poster={poster} extra="rotate-[-2deg] border-2 border-foreground" />

                        <div className="min-w-0 flex-1">
                            <Link to={`/peliculas/${grupo.funciones[0].idPelicula}`}>
                                <h2 className="truncate font-display text-base leading-tight text-foreground uppercase" title={titulo}>
                                    {titulo}
                                </h2>
                                {grupo.pelicula && (
                                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                                        {formatearDuracion(grupo.pelicula.duracionMinutos)}
                                    </p>
                                )}
                            </Link>

                            <ChipsHorario
                                funciones={grupo.funciones}
                                clases={{
                                    activo: 'rounded-sm border border-primary bg-primary/90 text-primary-foreground hover:bg-primary',
                                    cancelado: 'rounded-sm border border-border bg-muted',
                                }}
                            />
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
