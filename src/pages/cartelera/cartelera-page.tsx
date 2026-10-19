// parte de la vista

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Popcorn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Container } from '@/components/common/container';
import { Spinner } from '@/components/ui/spinners';
import { carteleraService } from '@/services/cartelera.service';
import { peliculaService } from '@/services/pelicula.service';
import { useTemaPublico } from '@/lib/temas-publico';
import { Funcion } from '@/types/cartelera';
import { Pelicula } from '@/types/pelicula';
import { GrupoPelicula, TarjetasCartelera } from './tarjetas-cartelera';

// La cartelera lista FUNCIONES (horarios), no peliculas: la misma
// pelicula se repite tantas veces como funciones tenga. Se pinta como
// en cualquier cine: un afiche por pelicula y los horarios como chips
// debajo. Cada chip lleva a /funciones/:id para elegir asientos.
// La forma de las tarjetas cambia segun el tema activo (tarjetas-cartelera.tsx).
export const CarteleraPage = () => {
  const tema = useTemaPublico();
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
          <h1 className="font-display text-2xl tracking-wider uppercase">Cartelera</h1>
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
          {/* font-display: titulos con la fuente del tema activo */}
          <h1 className="font-display text-2xl tracking-wider uppercase">Cartelera</h1>
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
          <TarjetasCartelera grupos={grupos} tema={tema} />
        )}
      </div>
    </Container>
  );
};
