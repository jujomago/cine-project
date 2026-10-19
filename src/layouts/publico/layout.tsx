import { Helmet } from "react-helmet-async";
import { Link, Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { useAuth } from "@/auth/context/auth-context";

const ENLACES = [
    { titulo: 'Películas', ruta: '/peliculas' },
    { titulo: 'Cartelera', ruta: '/cartelera' }
]
export function PublicoLayout() {
    // el link al panel solo se muestra a quien puede abrirlo
    const { isAuthenticated, tieneRol, logout, user } = useAuth();
    const puedeVerPanel = tieneRol('ADMIN', 'GERENTE');
    const esCliente = tieneRol('CLIENTE');

    return (
        <>
            <Helmet><title>Cine</title></Helmet>
            {/* wrapper: #root es flex en fila, aqui se apilan cabecera, contenido y pie en columna.
                dark: toda la zona publica vive en modo "sala oscura" sin importar el tema del sistema.
                text-foreground: los titulares sin color propio heredarian el del body (claro).
                self-start + min-h-full: la caja crece con el contenido (si no, el flex la estira
                al alto del viewport y el fondo se corta a media pagina) */}
            <div className="dark flex min-h-full grow flex-col self-start bg-background text-foreground">
                {/* sticky: la cabecera se queda arriba al hacer scroll */}
                <header className="sticky top-0 z-10 border-b border-white/10 bg-background/90 backdrop-blur-md">
                    <Container className="flex h-16 items-center justify-between gap-6">
                        {/* Nombre: siempre lleva al inicio de la zona publica */}
                        <Link to="" className="group flex items-center gap-2">
                            <span className="font-display text-xl tracking-[0.2em] text-white uppercase">
                                Cine
                            </span>
                            {/* punto de luz tipo proyector */}
                            <span className="size-1.5 rounded-full bg-amber-400 transition-shadow group-hover:shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]" />
                        </Link>
                        <nav className="flex flex-1 items-center gap-6">
                            {ENLACES.map((enlace) => (
                                <NavLink
                                    key={enlace.ruta}
                                    to={enlace.ruta}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'border-b-2 border-amber-400 pb-0.5 text-sm font-medium text-white'
                                            : 'text-sm font-medium text-zinc-400 transition-colors hover:text-white'
                                    }
                                >
                                    {enlace.titulo}
                                </NavLink>
                            ))}
                        </nav>
                        {/* Segun sesion y rol: acceso rapido o ingresar */}
                        {!isAuthenticated ? (
                            <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white">
                                <Link to="/auth/signin">Ingresar</Link>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                {puedeVerPanel && (
                                    <>
                                        <Button variant="outline" size="sm" asChild className="hidden border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white sm:inline-flex">
                                            <Link to="/panel/peliculas/nueva">Nueva película</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white">
                                            <Link to="/panel/personas">Personas</Link>
                                        </Button>
                                    </>
                                )}
                                {esCliente && (
                                    <Button variant="outline" size="sm" asChild className="border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white">
                                        <Link to="/panel/mis-reservas">Mis reservas</Link>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={logout} className="border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white">
                                    Salir
                                </Button>
                                {/* separador y usuario con sus roles */}
                                <span className="hidden items-center gap-1.5 text-sm md:flex">
                                    <span className="text-zinc-600">|</span>
                                    <span className="font-medium text-zinc-200">{user?.usuario}</span>
                                    <span className="rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-xs font-medium text-amber-400">
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
                <footer className="border-t border-white/10 bg-black/40">
                    <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
                        <Link to="" className="font-display text-lg tracking-[0.2em] text-zinc-300 uppercase">
                            Cine
                        </Link>
                        <nav className="flex gap-6">
                            {ENLACES.map((enlace) => (
                                <Link
                                    key={enlace.ruta}
                                    to={enlace.ruta}
                                    className="text-sm text-zinc-500 transition-colors hover:text-amber-300"
                                >
                                    {enlace.titulo}
                                </Link>
                            ))}
                        </nav>
                        <p className="text-xs text-zinc-600">
                            {new Date().getFullYear()} · Películas, horarios y reservas
                        </p>
                    </Container>
                </footer>
            </div>
        </>
    )
}
