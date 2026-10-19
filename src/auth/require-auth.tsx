import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Bloquea las rutas privadas.
 *
 * Si no hay sesion, manda al formulario guardando en `next` a donde se
 * queria entrar, para volver ahi despues de iniciar sesion.
 *
 * Si se pasa `roles`, ademas exige al menos uno de ellos: sin el rol se
 * muestra la pantalla 403 (no al login, porque la sesion si existe).
 */
export const RequireAuth = ({ roles }: { roles?: string[] }) => {
  const { isAuthenticated, loading, tieneRol } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth/signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (roles && roles.length > 0 && !tieneRol(...roles)) {
    return <Navigate to="/error/403" replace />;
  }

  return <Outlet />;
};
