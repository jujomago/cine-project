import {
  CalendarDays,
  Clapperboard,
  Home,
  Popcorn,
  Ticket,
  UserCog,
  Users,
} from 'lucide-react';
import { type MenuConfig } from './types';

/**
 * Menú de la aplicación de cine.
 *
 * Las rutas que aún no existen quedan con `disabled: true` para que se vean
 * en la barra lateral pero no lleven a un 404. Al construir cada pantalla, se
 * quita esa bandera y se agrega la ruta en `app-routing-setup.tsx`.
 *
 */
export const MENU_SIDEBAR: MenuConfig = [
  {
    title: 'Inicio',
    icon: Home,
    path: '/',
  },
  { heading: 'Cartelera' },
  {
    title: 'Funciones',
    icon: CalendarDays,
    path: '/cartelera',
    // disabled: true,
  },
  {
    title: 'Películas',
    icon: Clapperboard,
    path: '/peliculas',
    // disabled: true,
  },
  { heading: 'Ventas' },
  {
    title: 'Reservar',
    icon: Ticket,
    path: '/reservas/nueva',
    disabled: true,
  },
  {
    title: 'Mis reservas',
    icon: Popcorn,
    path: '/reservas',
    disabled: true,
  },
  { heading: 'Administración' },
  {
    title: 'Personas',
    icon: Users,
    path: '/panel/personas',
  },
  {
    title: 'Roles',
    icon: UserCog,
    path: '/roles',
    disabled: true,
  },
];

/** El menú superior reutiliza las mismas entradas: no hay mega menú que mantener. */
export const MENU_MEGA: MenuConfig = [
  { title: 'Inicio', path: '/' },
  { title: 'Cartelera', path: '/cartelera'},
  { title: 'Películas', path: '/peliculas'},
];

export const MENU_MEGA_MOBILE: MenuConfig = MENU_MEGA;
