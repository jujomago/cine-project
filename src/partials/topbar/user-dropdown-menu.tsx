import { ReactNode } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

/**
 * Menú de la esquina superior derecha.
 *
 * Se quitaron los enlaces de la plantilla (perfil, facturación, equipos…)
 * porque apuntaban a páginas demo que ya no existen. Quedan las opciones que
 * sí funcionan: tema oscuro y cerrar sesión.
 */
export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const nombre = user?.usuario ?? 'Usuario';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Identidad */}
        <div className="flex flex-col gap-1 p-3">
          <span className="text-sm font-semibold text-mono">{nombre}</span>
          <span className="text-xs text-muted-foreground">
            Sesion de prueba
          </span>
        </div>

        <DropdownMenuSeparator />

        {/* Tema oscuro */}
        <DropdownMenuItem
          className="flex items-center justify-between"
          onSelect={(e) => e.preventDefault()}
        >
          <span className="flex items-center">
            <Moon className="size-4 me-2" />
            Modo oscuro
          </span>
          <Switch
            size="sm"
            checked={theme === 'dark'}
            onCheckedChange={(activo) => setTheme(activo ? 'dark' : 'light')}
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
