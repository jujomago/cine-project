import { useEffect, useState } from 'react';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { personaService } from '@/services/persona.service';
import { Persona } from '@/types/persona';

const POR_PAGINA = 10;

function formatearFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-BO');
}

// Listado del area administrativa. Exige sesion iniciada con rol
// ADMIN o GERENTE: si el token no llega, el backend responde 401
// y el interceptor de http.ts manda al login.
export function PersonasPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // lo que se escribe en los campos
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    // lo que realmente se manda al backend (se actualiza al buscar/limpiar).
    // Con los dos vacios se llama a listar; con alguno lleno, a buscar.
    const [filtroNombres, setFiltroNombres] = useState('');
    const [filtroApellidos, setFiltroApellidos] = useState('');

    useEffect(() => {
        setCargando(true);
        setError(null);

        const consulta =
            filtroNombres === '' && filtroApellidos === ''
                ? personaService.listar(pagina, POR_PAGINA)
                : personaService.buscar(filtroNombres, filtroApellidos, pagina, POR_PAGINA);

        consulta
            .then((respuesta) => {
                setPersonas(respuesta.data);
                setTotalPaginas(respuesta.totalPaginas);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [pagina, filtroNombres, filtroApellidos]);

    function buscar() {
        setFiltroNombres(nombres);
        setFiltroApellidos(apellidos);
        setPagina(1);
    }

    function limpiar() {
        setNombres('');
        setApellidos('');
        setFiltroNombres('');
        setFiltroApellidos('');
        setPagina(1);
    }

    if (cargando) {
        return (
            <Container>
                <p>Cargando personas....</p>
            </Container>
        )
    }

    if (error) {
        return (
            <Container>
                <p>{error}</p>
            </Container>
        )
    }

    return (
        <Container>
            <div className='space-y-6 py-8'>

                <h1 className='text-2xl font-semibold tracking-tight text-mono'>Personas</h1>

                {/* ── Buscador ── */}
                <div className='flex flex-wrap items-end gap-3'>
                    <div className='space-y-1'>
                        <label htmlFor='nombres' className='text-sm font-medium'>
                            Nombres
                        </label>
                        <Input
                            id='nombres'
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            placeholder='Ana'
                            className='w-48'
                        />
                    </div>
                    <div className='space-y-1'>
                        <label htmlFor='apellidos' className='text-sm font-medium'>
                            Apellidos
                        </label>
                        <Input
                            id='apellidos'
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            placeholder='Perez'
                            className='w-48'
                        />
                    </div>
                    <Button onClick={buscar}>Buscar</Button>
                    <Button variant='outline' onClick={limpiar}>Limpiar</Button>
                </div>

                {personas.length === 0 ? (
                    <p>No se encontraron personas</p>
                ) : (
                    <>
                        {/* ── Tabla ── */}
                        <div className='overflow-x-auto rounded-lg border border-border'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground'>
                                        <th className='px-4 py-3'>#</th>
                                        <th className='px-4 py-3'>Nombres</th>
                                        <th className='px-4 py-3'>Apellidos</th>
                                        <th className='px-4 py-3'>Documento</th>
                                        <th className='px-4 py-3'>Telefono</th>
                                        <th className='px-4 py-3'>Correo</th>
                                        <th className='px-4 py-3'>F. nacimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personas.map((persona) => (
                                        <tr key={persona.id} className='border-b border-border last:border-0'>
                                            <td className='px-4 py-3 text-mono'>{persona.id}</td>
                                            <td className='px-4 py-3'>{persona.nombres}</td>
                                            <td className='px-4 py-3'>{persona.apellidos}</td>
                                            <td className='px-4 py-3 text-mono'>{persona.documento}</td>
                                            <td className='px-4 py-3 text-mono'>{persona.telefono}</td>
                                            <td className='px-4 py-3'>{persona.email}</td>
                                            <td className='px-4 py-3 text-mono'>{formatearFecha(persona.fechaNacimiento)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Paginacion ── */}
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-muted-foreground'>
                                Pagina {pagina} de {totalPaginas}
                            </p>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    disabled={pagina <= 1}
                                    onClick={() => setPagina(pagina - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    disabled={pagina >= totalPaginas}
                                    onClick={() => setPagina(pagina + 1)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </Container>
    );
}
