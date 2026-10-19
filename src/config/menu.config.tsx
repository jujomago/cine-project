import {
  Armchair,
  CalendarDays,
  Clapperboard,
  Film,
  Home,
  Ticket,
  Users,
} from 'lucide-react';
import { type MenuConfig } from './types';

/**
 * Menú de la aplicación de cine.
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
  },
  {
    title: 'Películas',
    icon: Clapperboard,
    path: '/peliculas',
  },
  { heading: 'Cuenta' },
  {
    title: 'Mis reservas',
    icon: Armchair,
    path: '/panel/mis-reservas',
    // el backend exige rol CLIENTE para consultar mis reservas
    roles: ['CLIENTE'],
  },
  { heading: 'Administración' },
  {
    title: 'Personas',
    icon: Users,
    path: '/panel/personas',
    roles: ['ADMIN', 'GERENTE'],
  },
  {
    title: 'Nueva película',
    icon: Film,
    path: '/panel/peliculas/nueva',
    roles: ['ADMIN', 'GERENTE'],
  },
  {
    title: 'Programación',
    icon: Ticket,
    path: '/panel/funciones',
    roles: ['ADMIN', 'GERENTE'],
  },
  {
    title: 'Nueva función',
    icon: CalendarDays,
    path: '/panel/funciones/nueva',
    roles: ['ADMIN', 'GERENTE'],
  },
];

/** El menú superior reutiliza las mismas entradas: no hay mega menú que mantener. */
export const MENU_MEGA: MenuConfig = [
  { title: 'Inicio', path: '/' },
  { title: 'Cartelera', path: '/cartelera'},
  { title: 'Películas', path: '/peliculas'},
];

export const MENU_MEGA_MOBILE: MenuConfig = MENU_MEGA;
