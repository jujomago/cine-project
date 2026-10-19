import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { Button } from '@/components/ui/button';
import { reservaService } from '@/services/reserva.service';
import { MisReserva } from '@/types/reserva';
import { formatearFecha, formatearHora, formatearPrecio } from '@/lib/utils';

// Colores del estado de la reserva
const ESTILOS_ESTADO: Record<string, string> = {
    PENDIENTE: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    CONFIRMADA: 'bg-primary/10 text-primary border-primary/30',
    CANCELADA: 'bg-destructive/10 text-destructive border-destructive/30',
};

// Reservas del usuario autenticado (GET /reservas/mis-reservas)
export function MisReservasPage() {
    const [reservas, setReservas] = useState<MisReserva[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        reservaService.obtenerMisReservas()
            .then(setReservas)
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
                    <h1 className='text-2xl font-semibold tracking-tight text-mono'>Mis reservas</h1>
                    <Button asChild>
                        <Link to='/cartelera'>Reservar otra</Link>
                    </Button>
                </div>

                {reservas.length === 0 ? (
                    <div className='space-y-4 rounded-lg border border-border p-8 text-center'>
                        <p className='text-muted-foreground'>Aún no tienes reservas</p>
                        <Button asChild>
                            <Link to='/cartelera'>Ver cartelera</Link>
                        </Button>
                    </div>
                ) : (
                    <div className='overflow-x-auto rounded-lg border border-border'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground'>
                                    <th className='px-4 py-3'>Código</th>
                                    <th className='px-4 py-3'>Película</th>
                                    <th className='px-4 py-3'>Sala</th>
                                    <th className='px-4 py-3'>Función</th>
                                    <th className='px-4 py-3'>Asientos</th>
                                    <th className='px-4 py-3'>Total</th>
                                    <th className='px-4 py-3'>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className='border-b border-border last:border-0'>
                                        <td className='px-4 py-3 font-medium text-mono'>{reserva.codigoReserva}</td>
                                        <td className='px-4 py-3'>{reserva.pelicula}</td>
                                        <td className='px-4 py-3'>{reserva.sala}</td>
                                        <td className='px-4 py-3 text-mono'>
                                            {formatearFecha(reserva.fechaFuncion)} · {formatearHora(reserva.horaInicio)}
                                        </td>
                                        <td className='px-4 py-3'>
                                            <span className='flex flex-wrap gap-1'>
                                                {reserva.asientos.map((asiento) => (
                                                    <span key={`${asiento.filaAsiento}${asiento.numeroAsiento}`}
                                                        className='inline-block rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono'>
                                                        {asiento.filaAsiento}{asiento.numeroAsiento}
                                                    </span>
                                                ))}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3 text-mono'>{formatearPrecio(reserva.total)}</td>
                                        <td className='px-4 py-3'>
                                            <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reserva.estado] ?? 'bg-muted text-muted-foreground border-border'}`}>
                                                {reserva.estado}
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
