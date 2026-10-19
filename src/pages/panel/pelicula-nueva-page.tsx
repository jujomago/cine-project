import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ImageIcon } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinners';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Container } from '@/components/common/container';
import { peliculaService } from '@/services/pelicula.service';

// duracionMinutos va como texto en el formulario y se convierte al enviar
const getEsquemaPelicula = () =>
    z.object({
        titulo: z.string().trim().min(1, { message: 'El título es obligatorio' }),
        sinopsis: z.string().trim().min(1, { message: 'La sinopsis es obligatoria' }),
        duracionMinutos: z.string().trim().min(1, { message: 'La duración es obligatoria' }).refine(
            (valor) => /^\d+$/.test(valor) && Number(valor) > 0,
            { message: 'La duración debe ser un número entero mayor que cero' },
        ),
        fechaEstreno: z.string().min(1, { message: 'La fecha de estreno es obligatoria' }),
        activo: z.boolean(),
    });

type PeliculaFormType = z.infer<ReturnType<typeof getEsquemaPelicula>>;

// mismas reglas que el backend (multer.config.ts)
const MAXIMO_IMAGENES = 5;
const MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MiB
const TIPOS_IMAGEN = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function validarImagenes(archivos: File[]): string | null {
    if (archivos.length > MAXIMO_IMAGENES) {
        return `Puedes elegir hasta ${MAXIMO_IMAGENES} imágenes`;
    }
    for (const archivo of archivos) {
        if (!TIPOS_IMAGEN.includes(archivo.type)) {
            return `Formato no permitido: ${archivo.name} (solo JPG, PNG o WEBP)`;
        }
        if (archivo.size > MAXIMO_BYTES) {
            return `${archivo.name} supera los 5 MiB`;
        }
    }
    return null;
}

// Primera pantalla que escribe datos en el servidor: alta de pelicula
// con imagenes. Exige rol ADMIN o GERENTE.
export function PeliculaNuevaPage() {
    const navigate = useNavigate();

    // las imagenes van aparte del formulario: son archivos, no datos
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [previsualizaciones, setPrevisualizaciones] = useState<string[]>([]);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<PeliculaFormType>({
        resolver: zodResolver(getEsquemaPelicula()),
        defaultValues: {
            titulo: '',
            sinopsis: '',
            duracionMinutos: '',
            fechaEstreno: '',
            activo: true,
        },
    });

    // vista previa: una URL temporal por archivo; se libera al cambiar la seleccion
    useEffect(() => {
        const urls = imagenes.map((archivo) => URL.createObjectURL(archivo));
        setPrevisualizaciones(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [imagenes]);

    function cambiarImagenes(archivos: File[]) {
        const problema = validarImagenes(archivos);
        if (problema) {
            setError(problema);
            return;
        }
        setError(null);
        setImagenes(archivos);
    }

    async function onSubmit(values: PeliculaFormType) {
        try {
            setEnviando(true);
            setError(null);

            await peliculaService.crear(
                {
                    titulo: values.titulo,
                    sinopsis: values.sinopsis,
                    duracionMinutos: Number(values.duracionMinutos),
                    fechaEstreno: values.fechaEstreno,
                    activo: values.activo,
                },
                imagenes,
            );

            toast.success(`Película ${values.titulo} registrada`);
            // la pelicula nueva aparece en el catalogo publico
            navigate('/peliculas');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo registrar la película. Intenta de nuevo.',
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <Container>
            <div className="w-full max-w-xl space-y-6 py-8">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight text-mono">
                        Nueva película
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Registra la película y sus imágenes (JPG, PNG o WEBP, hasta 5 MiB cada una)
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
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="INTERESTELAR"
                                            disabled={enviando}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sinopsis"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sinopsis</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Un grupo de exploradores viaja por el espacio..."
                                            disabled={enviando}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duracionMinutos"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duración (minutos)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="169"
                                            disabled={enviando}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fechaEstreno"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de estreno</FormLabel>
                                    <FormControl>
                                        {/* type date entrega "1995-05-20", el formato que pide el backend */}
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

                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>Activa</FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                            Las películas inactivas no se muestran en el catálogo
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={enviando}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* ── Imagenes: aparte del formulario, son archivos ── */}
                        <div className="space-y-2">
                            <label htmlFor="imagenes" className="text-sm font-medium leading-none">
                                Imágenes
                            </label>
                            <Input
                                id="imagenes"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                disabled={enviando}
                                onChange={(e) => cambiarImagenes(Array.from(e.target.files ?? []))}
                            />
                            <p className="text-xs text-muted-foreground">
                                Opcionales: hasta {MAXIMO_IMAGENES} archivos de máximo 5 MiB
                            </p>

                            {/* vista previa de lo elegido */}
                            {previsualizaciones.length > 0 && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {previsualizaciones.map((url, i) => (
                                        <div
                                            key={url}
                                            className="relative overflow-hidden rounded-lg border border-border bg-muted"
                                        >
                                            <img
                                                src={url}
                                                alt={`Vista previa ${i + 1}`}
                                                className="size-24 object-cover"
                                            />
                                            <span className="absolute bottom-1 right-1 rounded bg-background/80 px-1 text-[10px] text-muted-foreground">
                                                {imagenes[i]?.name.length > 14
                                                    ? `${imagenes[i].name.slice(0, 12)}…`
                                                    : imagenes[i]?.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {imagenes.length === 0 && (
                                <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                                    <ImageIcon className="size-4" />
                                    Ninguna imagen elegida todavía
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={enviando}>
                            {enviando && <Spinner className="me-2 h-4 w-4 animate-spin" />}
                            {enviando ? 'Guardando…' : 'Registrar película'}
                        </Button>
                    </form>
                </Form>
            </div>
        </Container>
    );
}
