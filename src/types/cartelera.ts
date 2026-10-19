
export interface Funcion {
    idFuncion: number;
    idPelicula: number;
    pelicula: string;
    idSala: number;
    sala: string,
    tipoSala: string,
    fecha: string;
    horaInicio: string;
    horaFin: string;
    precio: number;
    estado: string;
}

// espera
export interface Sala {
    idSala: number;
    nombre: string;
    capacidad: number;
    tipo: string;
    activa: boolean;
}
 
// POST /cartelera/funciones (ADMIN o GERENTE)
export interface CrearFuncion {
    idPelicula: number;
    idSala: number;
    /** YYYY-MM-DD */
    fecha: string;
    /** HH:mm:ss */
    horaInicio: string;
    /** HH:mm:ss */
    horaFin: string;
    precio: number;
}

// la respuesta trae lo mismo que se envio, mas el idFuncion y el estado
export interface FuncionCreada {
    status: string;
    message?: string;
    data: CrearFuncion & { idFuncion: number; estado: string };
}

//  Asiento

export interface Asiento {
    idAsiento: number;
    idSala: number;
    sala: string;
    fila: string; // A,B,C
    numero: number;
    asiento: string; // A1
    tipo: string; // NORMAL, VIP, etc.
    activo: boolean;
    disponible: boolean;
}