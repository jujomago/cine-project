import { http } from "@/lib/http";
import { CrearPersona, PersonaCreada, PersonasPaginadas } from "@/types/persona";



// llamada a la api de personas
export const personaService = {

    // registro de cuenta (publico)
    async registrar(persona: CrearPersona): Promise<PersonaCreada> {
        const {data} = await http.post<PersonaCreada>('/persona', persona);
        return data;
    },

    // listado paginado del panel (protegido: ADMIN o GERENTE)
    async listar(pagina = 1, porPagina = 10): Promise<PersonasPaginadas> {
        const {data} = await http.get<PersonasPaginadas>('/persona', {
            params: {pagina, porPagina}
        });
        return data;
    },

    // busqueda por nombres y/o apellidos (parcial, sin distinguir mayusculas).
    // Si llegan los dos, el backend exige que coincidan los dos.
    async buscar(
        nombres: string,
        apellidos: string,
        pagina = 1,
        porPagina = 10,
    ): Promise<PersonasPaginadas> {
        // el backend rechaza parametros vacios, por eso solo se mandan los llenos
        const params: Record<string, string | number> = {pagina, porPagina};
        if (nombres.trim() !== '') params.nombres = nombres.trim();
        if (apellidos.trim() !== '') params.apellidos = apellidos.trim();

        const {data} = await http.get<PersonasPaginadas>('/persona/buscar', {
            params
        });
        return data;
    },

}