import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { Button } from '@/components/ui/button';
import { carteleraService } from '@/services/cartelera.service';
import { Funcion } from '@/types/cartelera';
import { formatearFecha, formatearHora, formatearPrecio } from '@/lib/utils';

// Colores del estado de la funcion
const ESTILOS_ESTADO: Record<string, string> = {
    PROGRAMADA: 'bg-primary/10 text-primary border-primary/30',
    CANCELADA: 'bg-destructive/10 text-destructive border-destructive/30',
    FINALIZADA: 'bg-muted text-muted-foreground border-border',
};

// Listado del area administrativa: todas las funciones del cine
export function FuncionesPage() {
    const [funciones, setFunciones] = useState<Funcion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carteleraService.listarFunciones()
            .then(setFunciones)
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    if (cargando) {
        return (
            <Container>
                <CargandoCentrado />
            </Container>
        )
    }

    if (error) {
        return (
            <Container>
                <ErrorCarga mensaje={error} />
            </Container>
        )
    }

    return (
        <Container>
            <div className='space-y-6 py-8'>

                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h1 className='text-2xl font-semibold tracking-tight text-mono'>Funciones</h1>
                    <Button asChild>
                        <Link to='/panel/funciones/nueva'>Nueva función</Link>
                    </Button>
                </div>

                {funciones.length === 0 ? (
                    <p>No hay funciones registradas</p>
                ) : (
                    <div className='overflow-x-auto rounded-lg border border-border'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground'>
                                    <th className='px-4 py-3'>#</th>
                                    <th className='px-4 py-3'>Película</th>
                                    <th className='px-4 py-3'>Sala</th>
                                    <th className='px-4 py-3'>Tipo</th>
                                    <th className='px-4 py-3'>Fecha</th>
                                    <th className='px-4 py-3'>Horario</th>
                                    <th className='px-4 py-3'>Precio</th>
                                    <th className='px-4 py-3'>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {funciones.map((funcion) => (
                                    <tr key={funcion.idFuncion} className='border-b border-border last:border-0'>
                                        <td className='px-4 py-3 text-mono'>{funcion.idFuncion}</td>
                                        <td className='px-4 py-3'>{funcion.pelicula}</td>
                                        <td className='px-4 py-3'>{funcion.sala}</td>
                                        <td className='px-4 py-3'>{funcion.tipoSala}</td>
                                        <td className='px-4 py-3 text-mono'>{formatearFecha(funcion.fecha)}</td>
                                        <td className='px-4 py-3 text-mono'>
                                            {formatearHora(funcion.horaInicio)} - {formatearHora(funcion.horaFin)}
                                        </td>
                                        <td className='px-4 py-3 text-mono'>{formatearPrecio(funcion.precio)}</td>
                                        <td className='px-4 py-3'>
                                            <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[funcion.estado] ?? 'bg-muted text-muted-foreground border-border'}`}>
                                                {funcion.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </Container>
    );
}
