import { useEffect, useState } from 'react';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { TemaPublico, useTemaPublico } from '@/lib/temas-publico';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { GrillaPublica } from './grilla-publico';
import { HeroePublico } from './heroe-publico';

/**
 * Home publico del cine.
 *
 * Cada tema activo tiene su propio hero, separador y grilla (logica en
 * heroe-publico.tsx y grilla-publico.tsx); los colores y la fuente de
 * titulares los define src/css/temas-publico.css. El tema se elige con
 * TEMA_POR_DEFECTO en src/lib/temas-publico.ts o con ?tema= en la URL.
 *
 * La pelicula mas reciente de la cartelera se muestra como destacada
 * en el hero; el resto forma la grilla.
 */

/** Separador de seccion distinto por tema (clases en temas-publico.css) */
const SEPARADORES: Record<TemaPublico, string> = {
    oscuro: 'film-strip',
    papel: 'separador-papel',
    neon: 'separador-neon',
    retro: 'separador-retro',
};

export function CineHomePage() {
    const tema = useTemaPublico();
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
            {/* ── Hero: pelicula destacada, composicion segun tema ── */}
            {destacada && <HeroePublico destacada={destacada} tema={tema} />}

            {/* ── Separador tematico ── */}
            <div className={SEPARADORES[tema]} aria-hidden="true" />

            {/* ── Cartelera completa ── */}
            <Container>
                <div className="space-y-8 py-14">

                    {cargando && <CargandoCentrado />}

                    {error && <ErrorCarga mensaje={error} />}

                    {!cargando && !error && peliculas.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="font-display text-2xl tracking-wide text-muted-foreground uppercase">
                                Sin funciones por ahora
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Vuelve pronto: la cartelera se renueva cada semana.
                            </p>
                        </div>
                    )}

                    {!cargando && !error && resto.length > 0 && (
                        <>
                            <div className="flex items-baseline justify-between border-b border-border pb-4">
                                <h2 className="font-display text-2xl tracking-wider text-foreground uppercase md:text-3xl">
                                    Cartelera
                                </h2>
                                <span className="text-xs text-muted-foreground">
                                    {resto.length} {resto.length === 1 ? 'pelicula' : 'peliculas'}
                                </span>
                            </div>

                            <GrillaPublica peliculas={resto} tema={tema} />
                        </>
                    )}

                </div>
            </Container>
        </>
    );
}
