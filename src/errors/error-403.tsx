import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Error403() {
  return (
    <>
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/media/illustrations/21.svg')}
          className="dark:hidden max-h-[160px]"
          alt="image"
        />
        <img
          src={toAbsoluteUrl('/media/illustrations/21-dark.svg')}
          className="hidden dark:block max-h-[160px]"
          alt="image"
        />
      </div>

      <Badge variant="destructive" appearance="outline" className="mb-3">
        403 Error
      </Badge>

      <h3 className="text-2xl font-semibold text-mono text-center mb-2">
        No tienes permiso para ver esta página
      </h3>

      <div className="text-base text-center text-secondary-foreground mb-10">
        Tu cuenta no tiene acceso a esta sección. Si crees que es un error,
        contacta al administrador o&nbsp;
        <Link
          to="/"
          className="text-primary font-medium hover:text-primary-active"
        >
          vuelve al inicio
        </Link>
        .
      </div>

      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </>
  );
}
