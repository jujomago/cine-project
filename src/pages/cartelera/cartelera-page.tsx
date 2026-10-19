// parte de la vista

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Clock, Popcorn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Container } from '@/components/common/container';
import { Spinner } from '@/components/ui/spinners';
import { carteleraService } from '@/services/cartelera.service';
import { peliculaService } from '@/services/pelicula.service';
import { formatearDuracion, formatearFechaCorta, formatearHora, formatearPrecio } from '@/lib/utils';
import { Funcion } from '@/types/cartelera';
import { Pelicula } from '@/types/pelicula';

interface GrupoPelicula {
  pelicula?: Pelicula;
  funciones: Funcion[];
}

// La cartelera lista FUNCIONES (horarios), no peliculas: la misma
// pelicula se repite tantas veces como funciones tenga. Se pinta como
// en cualquier cine: un afiche por pelicula y los horarios como chips
// debajo. Cada chip lleva a /funciones/:id para elegir asientos.
export const CarteleraPage = () => {
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carteleraService
      .listarFunciones()
      .then(setFunciones)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));

    // el catalogo se trae aparte solo para el poster y la duracion:
    // si falla, la cartelera igual funciona sin imagenes
    peliculaService
      .listarPeliculas(1, 100)
      .then((respuesta) => setPeliculas(respuesta.data))
      .catch(() => setPeliculas([]));
  }, []);

  // agrupa por pelicula preservando el orden fecha+hora del backend
  const grupos = useMemo<GrupoPelicula[]>(() => {
    const mapa = new Map<number, GrupoPelicula>();
    for (const funcion of funciones) {
      const grupo = mapa.get(funcion.idPelicula) ?? { funciones: [] };
      grupo.funciones.push(funcion);
      mapa.set(funcion.idPelicula, grupo);
    }

    const peliculaPorId = new Map(peliculas.map((pelicula) => [pelicula.id, pelicula]));
    return [...mapa.values()].map((grupo) => ({
      ...grupo,
      pelicula: peliculaPorId.get(grupo.funciones[0].idPelicula),
    }));
  }, [funciones, peliculas]);

  if (cargando) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner className="size-6" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="max-w-md space-y-6 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Cartelera</h1>
          <Alert variant="destructive">
            <AlertIcon>
              <AlertCircle className="h-4 w-4" />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Cine – Cartelera</title>
      </Helmet>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cartelera</h1>
          <p className="text-sm text-muted-foreground">
            Elige un horario para ver los asientos disponibles
          </p>
        </div>

        {funciones.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <Popcorn className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hay funciones programadas por ahora
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo) => {
              const titulo = grupo.pelicula?.titulo ?? grupo.funciones[0].pelicula;
              const poster = grupo.pelicula?.imagenes[0];

              return (
                <article key={grupo.funciones[0].idPelicula} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  {/* afiche pequeno: solo para reconocer la pelicula.
                      El protagonista son los horarios, no el afiche */}
                  <Link
                    to={`/peliculas/${grupo.funciones[0].idPelicula}`}
                    className="w-24 shrink-0 self-start"
                  >
                    {/* aspect-[2/3] es la proporcion de un afiche de cine */}
                    <div className="overflow-hidden rounded-md bg-muted aspect-[2/3]">
                      {poster ? (
                        <img
                          src={peliculaService.urlImagen(poster)}
                          alt={titulo}
                          // loading lazy: no descarga las imagenes de abajo
                          // hasta que el usuario llegue a ellas
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* contenido: titulo + bloque de horarios destacado */}
                  <div className="min-w-0 flex-1">
                    <Link to={`/peliculas/${grupo.funciones[0].idPelicula}`}>
                      <h2 className="truncate text-sm font-medium leading-tight text-mono" title={titulo}>
                        {titulo}
                      </h2>
                      {grupo.pelicula && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatearDuracion(grupo.pelicula.duracionMinutos)}
                        </p>
                      )}
                    </Link>

                    {/* bloque de horarios: el foco de la tarjeta */}
                    <div className="mt-3 rounded-lg bg-muted/60 p-2">
                      <p className="mb-1.5 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <Clock className="size-3" />
                        Horarios ({grupo.funciones.length})
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {grupo.funciones.map((funcion) => {
                          const cancelada = funcion.estado.toUpperCase() === 'CANCELADA';
                          const hora = formatearHora(funcion.horaInicio);
                          const fecha = formatearFechaCorta(funcion.fecha);

                          if (cancelada) {
                            return (
                              <span
                                key={funcion.idFuncion}
                                title="Función cancelada"
                                className="rounded-md border border-border px-2 py-1 text-center text-xs leading-tight text-muted-foreground line-through opacity-60"
                              >
                                {hora}
                                <span className="block text-[10px]">{fecha}</span>
                              </span>
                            );
                          }

                          return (
                            <Link
                              key={funcion.idFuncion}
                              to={`/funciones/${funcion.idFuncion}`}
                              title={`${fecha} · ${hora} · ${funcion.sala} · ${formatearPrecio(funcion.precio)}`}
                              className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-center text-xs leading-tight text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                              <span className="font-semibold">{hora}</span>
                              <span className="block text-[10px] opacity-80">
                                {fecha} · {funcion.sala}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};
