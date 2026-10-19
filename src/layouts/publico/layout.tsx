import { useLayoutEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Link, Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { useAuth } from "@/auth/context/auth-context";
import { esTemaOscuro, useTemaPublico } from "@/lib/temas-publico";
import { enlacesPorTema } from "./enlaces";
import { PiePublico } from "./pie-publico";

export function PublicoLayout() {
    // el link al panel solo se muestra a quien puede abrirlo
    const { isAuthenticated, tieneRol, logout, user } = useAuth();
    const puedeVerPanel = tieneRol('ADMIN', 'GERENTE');
    const esCliente = tieneRol('CLIENTE');

    // tema activo: ?tema=papel lo previsualiza; TEMA_POR_DEFECTO en src/lib/temas-publico.ts
    const tema = useTemaPublico();
    const esOscuro = esTemaOscuro(tema);
    // los enlaces cambian de nombre segun el tema (Largometrajes, Estrenos, ...)
    const enlaces = enlacesPorTema(tema);

    // la clase .dark del <html> gobierna el fondo del body y las variantes
    // dark: de toda la página; se sincroniza para que los temas claros lo quiten
    // aunque el sistema operativo esté en modo oscuro
    useLayoutEffect(() => {
        const raiz = document.documentElement;
        const teniaOscuro = raiz.classList.contains('dark');
        raiz.classList.toggle('dark', esOscuro);
        return () => {
            raiz.classList.toggle('dark', teniaOscuro);
        };
    }, [esOscuro]);

    return (
        <>
            <Helmet><title>Cine</title></Helmet>
            {/* wrapper: #root es flex en fila, aqui se apilan cabecera, contenido y pie en columna.
                zona-publica + data-tema: aplican los colores del tema elegido (temas-publico.css).
                dark: solo los temas oscuros encienden las variantes dark: de la zona publica.
                text-foreground: los titulares sin color propio heredarian el del body (claro).
                self-start + min-h-full: la caja crece con el contenido (si no, el flex la estira
                al alto del viewport y el fondo se corta a media pagina) */}
            <div
                data-tema={tema}
                className={`zona-publica ${esOscuro ? 'dark' : ''} flex min-h-full grow flex-col self-start bg-background text-foreground`}
            >
                {/* sticky: la cabecera se queda arriba al hacer scroll */}
                <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-md">
                    {/* relative: el nav se centra con left-1/2 sobre este contenedor */}
                    <Container className="relative flex h-16 items-center justify-between gap-6">
                        {/* Nombre: siempre lleva al inicio de la zona publica */}
                        <Link to="" className="group flex items-center gap-2">
                            <span className="font-display text-xl tracking-[0.2em] text-foreground uppercase">
                                Cine
                            </span>
                            {/* punto de luz tipo proyector (el brillo va en temas-publico.css) */}
                            <span className="punto-proyector size-1.5 rounded-full bg-acento" />
                        </Link>
                        {/* centrado absoluto: el logo y los botones cambian de ancho
                            segun sesion/rol, y el nav igual debe quedar en el medio */}
                        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-5 sm:gap-6">
                            {enlaces.map((enlace) => (
                                <NavLink
                                    key={enlace.ruta}
                                    to={enlace.ruta}
                                    // font-display: la fuente del tema activo, como el logo
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'border-b-2 border-acento pb-0.5 font-display text-sm tracking-[0.15em] text-foreground uppercase'
                                            : 'font-display text-sm tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground'
                                    }
                                >
                                    {enlace.titulo}
                                </NavLink>
                            ))}
                        </nav>
                        {/* Segun sesion y rol: acceso rapido o ingresar */}
                        {!isAuthenticated ? (
                            <Button variant="outline" size="sm" asChild className="bg-transparent">
                                <Link to="/auth/signin">Ingresar</Link>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                {puedeVerPanel && (
                                    <>
                                        <Button variant="outline" size="sm" asChild className="hidden bg-transparent sm:inline-flex">
                                            <Link to="/panel/peliculas/nueva">Nueva película</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild className="bg-transparent">
                                            <Link to="/panel/personas">Personas</Link>
                                        </Button>
                                    </>
                                )}
                                {esCliente && (
                                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                                        <Link to="/panel/mis-reservas">Mis reservas</Link>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={logout} className="bg-transparent">
                                    Salir
                                </Button>
                                {/* separador y usuario con sus roles */}
                                <span className="hidden items-center gap-1.5 text-sm md:flex">
                                    <span className="text-muted-foreground">|</span>
                                    <span className="font-medium text-foreground">{user?.usuario}</span>
                                    <span className="rounded border border-acento/30 bg-acento/10 px-1.5 py-0.5 text-xs font-medium text-acento">
                                        {(user?.roles ?? []).join(' · ')}
                                    </span>
                                </span>
                            </div>
                        )}
                    </Container>
                </header>
                {/* Outlet: aqui React Router inserta la pantalla de la ruta actual */}
                <main className="grow">
                    <Outlet />
                </main>
                {/* pie con variante propia del tema activo (pie-publico.tsx) */}
                <PiePublico tema={tema} />
            </div>
        </>
    )
}
