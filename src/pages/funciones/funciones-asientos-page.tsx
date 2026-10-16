import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Asiento, Funcion } from "@/types/cartelera";
import { Link, useParams, useNavigate } from "react-router-dom";
import { carteleraService } from "@/services/cartelera.service";
import { useAuth } from "@/auth/context/auth-context";
import { reservaService } from "@/services/reserva.service";
import { toast } from "sonner";


export function FuncionAsientosPage() {
    const { id } = useParams<{ id: string }>();
    const idFuncion = Number(id);
    const [asientos, setAsientos] = useState<Asiento[]>([]);
    const [funcion, setFuncion] = useState<Funcion | undefined>();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //Los id de butacas que el usuario eligio 
    const [elegidos, setElegidos] = useState<number[]>([]);

    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [reservado, setReservado] = useState(false);


    useEffect(() => {
        setCargando(true);
        Promise.all([
            carteleraService.asientosDeFuncion(idFuncion),
            carteleraService.listarFunciones(),
        ])
            .then(([butacas, funciones]) => {
                setAsientos(butacas);
                setFuncion(funciones.find((f) => f.idFuncion === idFuncion));
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false))
    }, [idFuncion])

    // agruparlo por fila
    const porFila = useMemo(() => {
        const mapa = new Map<string, Asiento[]>();
        for (const asiento of asientos) {
            const fila = mapa.get(asiento.fila) ?? [];
            fila.push(asiento);
            mapa.set(asiento.fila, fila);
        }

        return [...mapa.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([fila, butacas]) => ({
                fila,
                butacas: butacas.sort((x, y) => x.numero - y.numero),
            })
            )


    }, [asientos])

    function alternar(idAsiento: number) {
        setElegidos((previos) =>
            previos.includes(idAsiento)
                ? previos.filter((x) => x !== idAsiento) : [...previos, idAsiento],
        )
    }

    const total = elegidos.length * (funcion?.precio ?? 0)

    const nombresElegidos = asientos
        .filter((a) => elegidos.includes(a.idAsiento))
        .map((a) => a.asiento)
        .join(', ');


    if (cargando) {
        return (
            <Container>
                <p>Cargando pelicula....</p>
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

    async function reservar() {
        if (!isAuthenticated || !user) {
            navigate(`/auth/signin?next=/funciones/${idFuncion}`);
            return;
        }
        if (!funcion) return;
        try {
            setReservado(true);

            const respuesta = await reservaService.crear({
                idCliente: user.id,
                idFuncion: funcion.idFuncion,
                fechaReserva: new Date().toISOString(),
                codigoReserva: reservaService.generarCodigo(funcion.idFuncion),
                estado: 'PENDIENTE',
                total,
                detalles: elegidos.map((idAsiento) => ({
                    idAsiento,
                    precio: funcion.precio,
                })),
            });

            toast.success(`Reserva creada: ${respuesta.data.reserva.codigo}`);
            navigate('/peliculas')
        } catch (e) {
            // con toast y no setError: un fallo no debe borrar el mapa de asientos
            toast.error((e as Error).message || 'No se pudo crear la reserva');
        } finally {
            setReservado(false);
        }
    }





    return (
        <Container>
            <div className="py-8">
                {
                    funcion && (
                        <Link to={`/peliculas/${funcion.idPelicula}`} className="">
                            volver a {funcion.pelicula}
                        </Link>
                    )
                }
                <div className="mt-4">
                    <h1 className="text-2xl font-semibold tracking-tight text-mono"> {funcion?.pelicula ?? 'Funcion'} </h1>
                    {/* { funcion && (
                <p>
                    {funcion.sala} - {funcion.tipoSala}
                </p>
            )} */}
                </div>


                <div className="mt-10 flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="rounded-t-[50%] border-t-4 border-primary/40 
            pb-2 pt-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
                            Pantalla
                        </div>

                        {/* las filas */}
                        <div className="mt-8 space-y-3">
                            {porFila.map(({ fila, butacas }) => (
                                <div key={fila} className="flex items-center justify-center gap-2">
                                    <span className="w-5 text-xs text-muted-foreground"> {fila} </span>
                                    <div className="flex gap-1.5">
                                        {butacas.map((butaca) => {
                                            const elegido = elegidos.includes(butaca.idAsiento);
                                            return (
                                                // BOTON MEJORADOCON ESTILOS
                                                <button
                                                    key={butaca.idAsiento}
                                                    type="button"
                                                    // Las ocupadas no se pueden pulsar
                                                    disabled={!butaca.disponible}
                                                    onClick={() => alternar(butaca.idAsiento)}
                                                    title={butaca.asiento}
                                                    className={[
                                                        'size-7 rounded text-[10px] transition-colors',
                                                        !butaca.disponible
                                                            ? 'cursor-not-allowed bg-muted text-muted-foreground/40'
                                                            : elegido
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-secondary hover:bg-primary/30',
                                                    ].join(' ')}
                                                >
                                                    {butaca.numero}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                        </div>
                        {/* ── Leyenda ── */}
                        <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <span className="size-4 rounded bg-secondary" /> Libre
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="size-4 rounded bg-primary" /> Elegido
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="size-4 rounded bg-muted" /> Ocupado
                            </span>
                        </div>
                    </div>
                </div>
                {/* ── Resumen ── */}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-5">
                    <div>
                        <p className="text-sm text-mono">
                            {elegidos.length === 0 ? 'Ninguna butaca elegida' : `${elegidos.length} Butacas: ${nombresElegidos}`

                            }
                        </p>
                        <p className="mt-1 text-xl font-semibold text-mono">Bs {total}</p>
                    </div>
                    <Button onClick={reservar} disabled={elegidos.length === 0 || reservado}>
                        {reservado ? 'Reservando…' : 'Reservar'}
                    </Button>
                </div>
            </div>
        </Container>
    )
}