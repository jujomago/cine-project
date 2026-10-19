import { AlertCircle } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinners';

/**
 * Spinner centrado para pantallas que cargan datos.
 * Se usa dentro del Container de cada pagina.
 */
export function CargandoCentrado() {
    return (
        <div className="flex justify-center py-20">
            <Spinner className="size-6" />
        </div>
    );
}

/**
 * Alerta de error para fallos al cargar datos.
 * Se usa dentro del Container de cada pagina.
 */
export function ErrorCarga({ mensaje }: { mensaje: string }) {
    return (
        <div className="max-w-md py-6">
            <Alert variant="destructive">
                <AlertIcon>
                    <AlertCircle className="h-4 w-4" />
                </AlertIcon>
                <AlertTitle>{mensaje}</AlertTitle>
            </Alert>
        </div>
    );
}
