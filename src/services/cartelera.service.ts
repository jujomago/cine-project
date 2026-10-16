import { http } from "@/lib/http";
import { Funcion, Sala, Asiento } from "@/types/cartelera";


// llamada a la api de cartelera
export const carteleraService = {

    // trae las funciones de de la pelicula
    async listarFunciones(idPelicula?: number): Promise<Funcion[]> {
        const {data} = await http.get<Funcion[]>('/cartelera/funciones', {
            params: {idPelicula}
        });
        return data;
    },

    //  trae las salas del cine
    async listarSalas(): Promise<Sala[]> {
        const {data} = await http.get<Sala[]>('/cartelera/salas');
        return data;
    },

    async asientosDeFuncion(idFuncion: number): Promise<Asiento[]>{
        const {data} = await http.get<Asiento[]>(`/cartelera/funciones/${idFuncion}/asientos`);
        return data;
    }
}