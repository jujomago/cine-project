import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import { UsuarioSesion } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { estaVencido, leerToken } from '@/lib/jwt';

export function AuthProvider({ children }: PropsWithChildren) {
  // Empieza en true: hasta revisar el token no se sabe si hay sesion,
  // y asi RequireAuth espera en vez de mandar al login antes de tiempo
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioSesion | undefined>();

  const login = useCallback(async (usuario: string, contrasena: string) => {
    
    const token = await authService.login({usuario, contrasena});

    const payload = leerToken(token);

    if (!payload) {
      throw new Error('El token recibido no se puedo leer.');
    }

    authService.guardarToken(token);

    const sesion = {
      id: payload.id,
      usuario: payload.usuario,
      roles: payload.roles,
    }

    setUser(sesion);
  }, []);

  const logout = useCallback(() => {
    // Sin esto el token queda guardado y el F5 vuelve a abrir la sesion
    authService.borrarToken();
    setUser(undefined);
  }, []);


  const tieneRol = useCallback(
    (...roles: string[])  => roles.some((rol) => user?.roles.includes(rol)),
    [user]
  )

  // Al recargar (F5) React pierde el estado, pero el token sigue en
  // localStorage: se lee de ahi para reconstruir la sesion
  useEffect(() => {
    const token = authService.obtenerToken();
    const payload = token ? leerToken(token) : null;

    if (payload && !estaVencido(payload)) {
      setUser({
        id: payload.id,
        usuario: payload.usuario,
        roles: payload.roles,
      });
    } else if (token) {
      // Token roto o vencido: ya no sirve, mejor no dejarlo guardado
      authService.borrarToken();
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated: user !== undefined,
        user,
        login,
        logout,
        tieneRol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
