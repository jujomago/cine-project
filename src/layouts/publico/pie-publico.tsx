import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { TemaPublico } from '@/lib/temas-publico';
import { enlacesPorTema } from './enlaces';

/**
 * Pie de la zona pública: una variante por tema.
 * Cada tema tiene su propio contenido (texto, lemas y datos inventados)
 * además de su composición; los enlaces usan las etiquetas del tema.
 */
export function PiePublico({ tema }: { tema: TemaPublico }) {
    if (tema === 'papel') return <PiePapel />;
    if (tema === 'neon') return <PieNeon />;
    if (tema === 'retro') return <PieRetro />;
    return <PieOscuro />;
}

/** oscuro: el original — tres columnas sobre fondo suave */
function PieOscuro() {
    const enlaces = enlacesPorTema('oscuro');

    return (
        <footer className="border-t border-border bg-muted/30">
            <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
                <Link to="" className="font-display text-lg tracking-[0.2em] text-foreground uppercase">
                    Cine
                </Link>
                <nav className="flex gap-6">
                    {enlaces.map((enlace) => (
                        <Link
                            key={enlace.ruta}
                            to={enlace.ruta}
                            className="text-sm text-muted-foreground transition-colors hover:text-acento"
                        >
                            {enlace.titulo}
                        </Link>
                    ))}
                </nav>
                <p className="text-xs text-muted-foreground">
                    {new Date().getFullYear()} · Películas, horarios y reservas
                </p>
            </Container>
        </footer>
    );
}

/** papel: colofón de imprenta — filete doble, texto editorial y taquilla */
function PiePapel() {
    const enlaces = enlacesPorTema('papel');

    return (
        <footer className="bg-background">
            {/* filete doble: el mismo estilo del separador de la home */}
            <div className="separador-papel" aria-hidden="true" />
            <Container className="flex flex-col items-center gap-4 py-12 text-center">
                <Link to="" className="font-display text-2xl text-foreground">
                    Cine
                </Link>
                {/* lema del programa impreso */}
                <p className="max-w-md text-sm italic leading-relaxed text-muted-foreground">
                    Programación semanal cuidada a mano, como en los buenos
                    carteles de barrio.
                </p>
                <nav className="flex items-center gap-2 text-sm">
                    {enlaces.map((enlace, i) => (
                        <span key={enlace.ruta} className="flex items-center gap-2">
                            {i > 0 && <span className="text-muted-foreground" aria-hidden="true">·</span>}
                            <Link
                                to={enlace.ruta}
                                className="text-muted-foreground transition-colors hover:text-acento"
                            >
                                {enlace.titulo}
                            </Link>
                        </span>
                    ))}
                </nav>
                {/* filete fino como en un colofón */}
                <div className="h-px w-24 bg-border" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">
                    Taquilla abierta de martes a domingo · 15:00 – 22:30
                </p>
                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} · Todos los derechos reservados
                </p>
            </Container>
        </footer>
    );
}

/** neon: línea brillante, lema de streaming y chips de enlaces */
function PieNeon() {
    const enlaces = enlacesPorTema('neon');

    return (
        <footer className="bg-background">
            <div className="separador-neon" aria-hidden="true" />
            <Container className="flex flex-col items-center gap-5 py-10">
                <Link to="" className="font-display text-lg tracking-[0.2em] text-foreground uppercase">
                    Cine
                </Link>
                {/* lema moderno */}
                <p className="text-sm text-muted-foreground">
                    Reserva tu butaca en tres toques. Sin filas, sin papel.
                </p>
                <nav className="flex flex-wrap justify-center gap-2">
                    {enlaces.map((enlace) => (
                        <Link
                            key={enlace.ruta}
                            to={enlace.ruta}
                            className="rounded-full border border-border px-3 py-1 text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:border-acento hover:text-acento"
                        >
                            {enlace.titulo}
                        </Link>
                    ))}
                </nav>
                <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                    Estrenos cada jueves a medianoche
                </p>
                <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                    © {new Date().getFullYear()} Cine
                </p>
            </Container>
        </footer>
    );
}

/** retro: borde doble grueso, lema de sala clásica y subrayado punteado */
function PieRetro() {
    const enlaces = enlacesPorTema('retro');

    return (
        <footer className="border-t-8 border-double border-foreground bg-muted/40">
            <Container className="flex flex-col items-center gap-4 py-10">
                <Link to="" className="font-display text-2xl text-foreground uppercase">
                    Cine
                </Link>
                {/* lema de sala antigua */}
                <p className="text-sm text-muted-foreground">
                    Proyecciones de tarde y noche · Buen sonido, mejores palomitas.
                </p>
                <nav className="flex gap-6">
                    {enlaces.map((enlace) => (
                        <Link
                            key={enlace.ruta}
                            to={enlace.ruta}
                            className="text-sm text-muted-foreground underline decoration-dashed underline-offset-4 transition-colors hover:text-acento hover:decoration-solid"
                        >
                            {enlace.titulo}
                        </Link>
                    ))}
                </nav>
                <div className="h-px w-20 bg-border" aria-hidden="true" />
                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {new Date().getFullYear()} · Cine · Desde siempre, para siempre
                </p>
            </Container>
        </footer>
    );
}
