import { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Container } from '@/components/common/container';
import { CargandoCentrado, ErrorCarga } from '@/components/common/estados-carga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinners';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/auth/context/auth-context';
import { formatearFecha } from '@/lib/utils';
import { personaService } from '@/services/persona.service';
import { authService } from '@/services/auth.service';
import { Persona } from '@/types/persona';
import { Rol } from '@/types/auth';

const POR_PAGINA = 10;

// Colores por rol en los chips de la columna Roles
const ESTILOS_ROL: Record<string, string> = {
    ADMIN: 'bg-destructive/10 text-destructive border-destructive/30',
    GERENTE: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    CLIENTE: 'bg-primary/10 text-primary border-primary/30',
};

// Listado del area administrativa. Exige sesion iniciada con rol
// ADMIN o GERENTE: si el token no llega, el backend responde 401
// y el interceptor de http.ts manda al login.
// La asignacion de roles vive aqui (solo ADMIN): no hay pagina aparte.
export function PersonasPage() {
    const { tieneRol } = useAuth();
    const esAdmin = tieneRol('ADMIN');

    const [personas, setPersonas] = useState<Persona[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    // se incrementa para recargar el listado tras asignar un rol
    const [recarga, setRecarga] = useState(0);

    // lo que se escribe en los campos
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    // lo que realmente se manda al backend (se actualiza al buscar/limpiar).
    // Con los dos vacios se llama a listar; con alguno lleno, a buscar.
    const [filtroNombres, setFiltroNombres] = useState('');
    const [filtroApellidos, setFiltroApellidos] = useState('');

    // ── Diálogo de asignar rol (solo ADMIN) ──
    const [personaARol, setPersonaARol] = useState<Persona | null>(null);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [idRol, setIdRol] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [errorDialogo, setErrorDialogo] = useState<string | null>(null);

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
    }, [pagina, filtroNombres, filtroApellidos, recarga]);

    // los roles disponibles se cargan una sola vez (requiere ADMIN o GERENTE)
    useEffect(() => {
        authService.listarRoles()
            .then(setRoles)
            .catch(() => setRoles([]));
    }, []);

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

    function abrirDialogo(persona: Persona) {
        setPersonaARol(persona);
        setIdRol('');
        setErrorDialogo(null);
    }

    // solo los roles que la persona aun no tiene
    const rolesDisponibles = personaARol
        ? roles.filter((rol) => !personaARol.roles.includes(rol.rol))
        : [];

    const asignarRol = useCallback(async () => {
        if (!personaARol || !idRol) {
            setErrorDialogo('Elige un rol para asignar');
            return;
        }
        try {
            setEnviando(true);
            setErrorDialogo(null);
            await authService.asignarRol(personaARol.id, Number(idRol));
            toast.success(
                `Rol asignado a ${personaARol.nombres} ${personaARol.apellidos}. Debe iniciar sesión de nuevo para usarlo.`,
            );
            setPersonaARol(null);
            setRecarga((valor) => valor + 1);
        } catch (err) {
            setErrorDialogo(
                err instanceof Error
                    ? err.message
                    : 'No se pudo asignar el rol. Intenta de nuevo.',
            );
        } finally {
            setEnviando(false);
        }
    }, [personaARol, idRol]);

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

                <div className='space-y-1.5'>
                    <h1 className='text-2xl font-semibold tracking-tight text-mono'>Personas</h1>
                    {esAdmin && (
                        <p className='text-sm text-muted-foreground'>
                            Puedes asignar roles desde la columna Roles. La persona debe
                            volver a iniciar sesión para usar el rol nuevo.
                        </p>
                    )}
                </div>

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
                            onKeyDown={(e) => e.key === 'Enter' && buscar()}
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
                            onKeyDown={(e) => e.key === 'Enter' && buscar()}
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
                                        <th className='px-4 py-3'>Roles</th>
                                        {esAdmin && <th className='px-4 py-3'>Acciones</th>}
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
                                            <td className='px-4 py-3'>
                                                {persona.tieneUsuario ? (
                                                    <span className='flex flex-wrap gap-1'>
                                                        {persona.roles.map((rol) => (
                                                            <span
                                                                key={rol}
                                                                className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${ESTILOS_ROL[rol] ?? 'bg-muted text-muted-foreground border-border'}`}
                                                            >
                                                                {rol}
                                                            </span>
                                                        ))}
                                                        {persona.roles.length === 0 && (
                                                            <span className='text-xs text-muted-foreground'>Sin roles</span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className='text-xs text-muted-foreground'>Sin usuario</span>
                                                )}
                                            </td>
                                            {esAdmin && (
                                                <td className='px-4 py-3'>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        disabled={!persona.tieneUsuario}
                                                        onClick={() => abrirDialogo(persona)}
                                                    >
                                                        Asignar rol
                                                    </Button>
                                                </td>
                                            )}
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

                {/* ── Diálogo: asignar rol (solo ADMIN) ── */}
                <Dialog open={personaARol !== null} onOpenChange={(abierto) => !abierto && setPersonaARol(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Asignar rol a {personaARol?.nombres} {personaARol?.apellidos}
                            </DialogTitle>
                            <DialogDescription>
                                La persona debe volver a iniciar sesión para usar el rol nuevo.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogBody className='space-y-4'>
                            {errorDialogo && (
                                <Alert variant='destructive'>
                                    <AlertIcon>
                                        <AlertCircle className='h-4 w-4' />
                                    </AlertIcon>
                                    <AlertTitle>{errorDialogo}</AlertTitle>
                                </Alert>
                            )}

                            {rolesDisponibles.length === 0 ? (
                                <p className='text-sm text-muted-foreground'>
                                    Esta persona ya tiene todos los roles disponibles.
                                </p>
                            ) : (
                                <div className='space-y-1'>
                                    <label className='text-sm font-medium'>Rol</label>
                                    <Select value={idRol} onValueChange={setIdRol} disabled={enviando}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Elige un rol' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rolesDisponibles.map((rol) => (
                                                <SelectItem key={rol.id} value={String(rol.id)}>
                                                    {rol.rol}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setPersonaARol(null)}
                                disabled={enviando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={asignarRol}
                                disabled={enviando || !idRol || rolesDisponibles.length === 0}
                            >
                                {enviando && <Spinner className='me-2 h-4 w-4 animate-spin' />}
                                {enviando ? 'Asignando…' : 'Asignar rol'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </Container>
    );
}
