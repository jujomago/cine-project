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
    const { isAuthenticated, tieneRol, logout } = useAuth();
    const puedeVerPanel = tieneRol('ADMIN', 'GERENTE');
    const esCliente = tieneRol('CLIENTE');

    return (
        <>
            <Helmet><title>Cine</title></Helmet>
            {/* wrapper: #root es flex en fila, aqui se apilan cabecera, contenido y pie en columna */}
            <div className="flex grow flex-col">
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
                        {/* Segun sesion y rol: acceso rapido o ingresar */}
                        {!isAuthenticated ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/auth/signin">Ingresar</Link>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                {puedeVerPanel && (
                                    <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to="/panel/peliculas/nueva">Nueva película</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to="/panel/personas">Personas</Link>
                                        </Button>
                                    </>
                                )}
                                {esCliente && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/panel/mis-reservas">Mis reservas</Link>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Salir
                                </Button>
                            </div>
                        )}
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
            </div>
        </>
    )
}
