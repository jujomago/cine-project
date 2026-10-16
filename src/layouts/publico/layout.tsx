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
    const { isAuthenticated, tieneRol } = useAuth();
    const puedeVerPanel = tieneRol('ADMIN', 'GERENTE');

    return (
        <>
            <Helmet><title>Cine</title></Helmet>
            {/* sticky: la cabecera se queda arriba al hacer scroll */}
            <header className="sticky top-0 z-10 border-b border-border bg-background">
                <Container className="flex h-16 items-center justify-between gap-6">
                    {/* Nombre: siempre lleva al inicio de la zona publica */}
                    <Link to="" className="text-lg font-semibold tracking-tight text-mono"> CINE </Link>
                    <nav className="flex flex-1 items-center gap-6">
                        {ENLACES.map((enlace) => (
                            <NavLink
                                key={enlace.ruta}
                                to={enlace.ruta}
                                className={({ isActive }) =>
                                    isActive ? 'text-sm font-medium text-primary' : 'text-sm font-medium text-secondary-foreground hover:text-primary'
                                }
                            >
                                {enlace.titulo}
                            </NavLink>
                        ))}
                    </nav>
                    {/* Acceso al panel privado o al login */}
                    {isAuthenticated && puedeVerPanel ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/panel/personas">Personas</Link>
                        </Button>
                    ) : !isAuthenticated ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/auth/signin">Ingresar</Link>
                        </Button>
                    ) : null}
                </Container>
            </header>
            {/* Outlet: aqui React Router inserta la pantalla de la ruta actual */}
            <main className="grow">
                <Outlet />
            </main>
            <footer className="border-t border-border py-6">
                <Container>
                    <p className="text-center text-sm text-muted-foreground"> Cine</p>
                </Container>
            </footer>
        </>
    )
}