import { useLocation } from 'react-router-dom';

/** Temas disponibles de la zona pública (coinciden con data-tema en temas-publico.css) */
export const TEMAS_PUBLICOS = ['oscuro', 'papel', 'neon', 'retro'] as const;
export type TemaPublico = (typeof TEMAS_PUBLICOS)[number];

/** Tema por defecto: cambiar aquí ('oscuro' | 'papel' | 'neon' | 'retro').
 *  Colores, fuentes y adornos de cada tema se editan en src/css/temas-publico.css */
export const TEMA_POR_DEFECTO: TemaPublico = 'neon';

/** Los temas oscuros necesitan la clase .dark en <html> (fondo del body y variantes dark:) */
export function esTemaOscuro(tema: TemaPublico): boolean {
  return tema === 'oscuro' || tema === 'neon';
}

/** Tema activo: ?tema=papel en la URL lo previsualiza sin tocar código */
export function useTemaPublico(): TemaPublico {
  const { search } = useLocation();
  const parametro = new URLSearchParams(search).get('tema');
  return parametro !== null &&
    (TEMAS_PUBLICOS as readonly string[]).includes(parametro)
    ? (parametro as TemaPublico)
    : TEMA_POR_DEFECTO;
}
