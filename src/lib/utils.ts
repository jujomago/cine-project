import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── Formateos compartidos por las pantallas del cine ──

// Las fechas llegan en dos formas: "YYYY-MM-DD" (peliculas, funciones)
// o ISO completa "1995-05-20T00:00:00.000Z" (persona). Se toman solo los
// primeros 10 caracteres (el dia real almacenado) y se arma en local:
// con new Date() a secas la ISO se interpreta en UTC y el dia se corre
function aFechaLocal(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00`);
}

// "2026-10-16" -> "16/10/2026"
export function formatearFecha(iso: string): string {
  return aFechaLocal(iso).toLocaleDateString('es-BO');
}

// "2026-10-16" -> "16 de octubre de 2026"
export function formatearFechaLarga(iso: string): string {
  return aFechaLocal(iso).toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// "2026-10-16" -> "16 oct"
export function formatearFechaCorta(iso: string): string {
  return aFechaLocal(iso).toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'short',
  });
}

// "19:00:00" -> "19:00"
export function formatearHora(hora: string): string {
  return hora.slice(0, 5);
}

// 35 -> "Bs 35,00"
export function formatearPrecio(precio: number): string {
  return `Bs ${precio.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
}

// 169 -> "2h 49m"
export function formatearDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return horas > 0 ? `${horas}h ${resto}m` : `${resto}m`;
}
