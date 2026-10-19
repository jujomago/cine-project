import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinners';
import { Container } from '@/components/common/container';
import { CargandoCentrado } from '@/components/common/estados-carga';
import { carteleraService } from '@/services/cartelera.service';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Sala } from '@/types/cartelera';

// ids y precio van como texto en el formulario y se convierten al enviar
const getEsquemaFuncion = () =>
    z.object({
        idPelicula: z.string().min(1, { message: 'Elige una película' }),
        idSala: z.string().min(1, { message: 'Elige una sala' }),
        fecha: z.string().min(1, { message: 'La fecha es obligatoria' }),
        horaInicio: z.string().min(1, { message: 'La hora de inicio es obligatoria' }),
        horaFin: z.string().min(1, { message: 'La hora de fin es obligatoria' }),
        precio: z.string().trim().min(1, { message: 'El precio es obligatorio' }).refine(
            (valor) => /^\d+(\.\d{1,2})?$/.test(valor) && Number(valor) > 0,
            { message: 'El precio debe ser un número mayor que cero, con máximo dos decimales' },
        ),
    }).superRefine((valores, ctx) => {
        // type time entrega "HH:mm": comprobar que el fin viene despues del inicio
        if (valores.horaInicio && valores.horaFin && valores.horaFin <= valores.horaInicio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['horaFin'],
                message: 'La hora de fin debe ser posterior a la hora de inicio',
            });
        }
    });

type FuncionFormType = z.infer<ReturnType<typeof getEsquemaFuncion>>;

// Alta de funciones del cine. Exige rol ADMIN o GERENTE.
export function FuncionNuevaPage() {
    const navigate = useNavigate();

    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FuncionFormType>({
        resolver: zodResolver(getEsquemaFuncion()),
        defaultValues: {
            idPelicula: '',
            idSala: '',
            fecha: '',
            horaInicio: '',
            horaFin: '',
            precio: '',
        },
    });

    // el backend solo acepta peliculas y salas activas
    useEffect(() => {
        Promise.all([
            peliculaService.listarPeliculas(1, 100),
            carteleraService.listarSalas(),
        ])
            .then(([respuesta, listadoSalas]) => {
                setPeliculas(respuesta.data.filter((pelicula) => pelicula.activo));
                setSalas(listadoSalas.filter((sala) => sala.activa));
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    async function onSubmit(values: FuncionFormType) {
        try {
            setEnviando(true);
            setError(null);

            // el backend pide HH:mm:ss: el input type time entrega "HH:mm"
            const respuesta = await carteleraService.crear({
                idPelicula: Number(values.idPelicula),
                idSala: Number(values.idSala),
                fecha: values.fecha,
                horaInicio: `${values.horaInicio}:00`,
                horaFin: `${values.horaFin}:00`,
                precio: Number(values.precio),
            });

            toast.success(`Función #${respuesta.data.idFuncion} registrada`);
            navigate('/panel/funciones');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo registrar la función. Intenta de nuevo.',
            );
        } finally {
            setEnviando(false);
        }
    }

    if (cargando) {
        return (
            <Container>
                <CargandoCentrado />
            </Container>
        )
    }

    return (
        <Container>
            <div className="w-full max-w-xl space-y-6 py-8">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight text-mono">
                        Nueva función
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Programa una película en una sala. El estado nace como PROGRAMADA
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertIcon>
                            <AlertCircle className="h-4 w-4" />
                        </AlertIcon>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="idPelicula"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Película</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={enviando}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Elige una película activa" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {peliculas.map((pelicula) => (
                                                <SelectItem key={pelicula.id} value={String(pelicula.id)}>
                                                    {pelicula.titulo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="idSala"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sala</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={enviando}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Elige una sala activa" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {salas.map((sala) => (
                                                <SelectItem key={sala.idSala} value={String(sala.idSala)}>
                                                    {sala.nombre} · {sala.tipo} · {sala.capacidad} butacas
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fecha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha</FormLabel>
                                    <FormControl>
                                        {/* type date entrega "2026-10-20", el formato que pide el backend */}
                                        <Input
                                            type="date"
                                            disabled={enviando}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="horaInicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de inicio</FormLabel>
                                        <FormControl>
                                            <Input type="time" disabled={enviando} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="horaFin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de fin</FormLabel>
                                        <FormControl>
                                            <Input type="time" disabled={enviando} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="precio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio por butaca (Bs)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            step="0.01"
                                            placeholder="35"
                                            disabled={enviando}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={enviando}>
                            {enviando && <Spinner className="me-2 h-4 w-4 animate-spin" />}
                            {enviando ? 'Guardando…' : 'Registrar función'}
                        </Button>
                    </form>
                </Form>
            </div>
        </Container>
    );
}
