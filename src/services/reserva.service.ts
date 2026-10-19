import { http } from "@/lib/http";
import { CrearReserva, MisReserva, ReservaCreada } from "@/types/reserva";


export const reservaService = {

    async crear(reserva: CrearReserva) : Promise<ReservaCreada> {
        const {data} = await http.post<ReservaCreada>('/reservas', reserva);
        return data;
    },

    // reservas del usuario autenticado (requiere token de CLIENTE).
    // el backend lo envuelve como { status, message, data: MisReserva[] }.
    // total llega como string ("30.00") porque es numeric de Postgres
    async obtenerMisReservas(): Promise<MisReserva[]> {
        const {data} = await http.get<{ data: MisReserva[] }>('/reservas/mis-reservas');
        return data.data.map((reserva) => ({ ...reserva, total: Number(reserva.total) }));
    },

    generarCodigo(idFuncion: number): string {
        // Fecha actual en base 36: un numero largo se vuelve texto corto
        const gestion = Date.now().toString(36).slice(-12);
        // Mayusculas: el backend las convierte igual, asi mostramos lo mismo que guarda
        return `RES-${idFuncion}-${gestion}`.toUpperCase();
           
    }
}