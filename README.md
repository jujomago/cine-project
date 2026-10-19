# Metronic 9 | All-in-One Tailwind based HTML/React/Next.js Template for Modern Web Applications

## Getting Started

Refer to the [Metronic Vite Documentation](https://docs.keenthemes.com/metronic-react)
for comprehensive guidance on setting up and getting started your project with Metronic.

## ReUI Components

Metronic now leverages [ReUI](https://reui.io), our open-source React component library.

Star the [ReUI on GitHub](https://github.com/keenthemes/reui) to help us grow the project and stay updated on new features!

## Login with Supabase Auth

This project uses Supabase for authentication. Follow these steps to set up and test the login functionality:

### Prerequisites

- Node.js 16.x or higher
- Npm or Yarn
- Tailwind CSS 4.x
- React 19.x
- A Supabase account and project

### Installation

To set up the project dependencies, including those required for React 19, use the `--force` flag to resolve any dependency conflicts:

```bash
npm install --force
```

### Environment Setup

1. Make sure your `.env` file is configured with Supabase credentials:

```

VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-admin-functions

```

### Creating a Demo User

For testing purposes, you can create a demo user with:

```bash
npm run create-demo-user
```

This will create a user with the following credentials:

- Email: demo@kt.com
- Password: demo123

### Login Features

The login implementation includes:

- Email/Password authentication
- Google OAuth integration
- Password reset flow
- Error handling
- Token management
- Protected routes

### Setting Up the Demo Layout

Follow the [Metronic Vite Documentation](https://docs.keenthemes.com/metronic-vite/guides/layouts) to configure and use the demo layout of your choice.

### Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173/auth/signin` to test the login functionality.

### Testing Login

You can test login using:

1. The demo account credentials
2. Register a new account (when implemented)
3. Google Sign-in (requires proper OAuth setup in Supabase)

### Reporting Issues

If you encounter any issues or have suggestions for improvement, please contact us at [support@keenthemes.com](mailto:support@keenthemes.com).
Include a detailed description of the issue or suggestion, and we will work to address it in the next stable release.

---

## Temas del frontend público

Toda la zona pública (home, /peliculas, /cartelera, detalle, butacas,
cabecera y pie) tiene **4 temas** intercambiables. Cada uno cambia colores,
fuente de titulares, textos del cabecera/pie **y** la forma de las tarjetas:

| Tema | Estilo | Titulares | Enlaces de cabecera |
|------|--------|-----------|---------------------|
| `oscuro` | Sala oscura con acento ámbar (el original, por defecto) | Anton | Películas · Cartelera |
| `papel` | Claro: fondo crema, acento rojo cortina, aire de cartelera impresa | Playfair Display | Largometrajes · Programación |
| `neon` | Oscuro azulado: acento cian, botones magenta, brillos y chips | Space Grotesk | Estrenos · Funciones |
| `retro` | Claro vintage: crema, verde bosque y mostaza, collage y marcos gruesos | Ultra | Ciclos · Sesiones |

### Cambiar colores (solo valores hexadecimales)

Todos los colores viven en **`src/css/temas-publico.css`**, cada tema en su
propio bloque y con comentarios en español. Basta con editar valores
`#RRGGBB`; no hay que tocar TypeScript ni saber Tailwind. El archivo explica
qué significa cada variable (fondo, texto, tarjetas, bordes, botones,
secundarios, títulos y acento).

### Cambiar la fuente de titulares

La variable `--font-display` de cada bloque en `temas-publico.css` define la
familia (logo, h1 de página, títulos de tarjeta y enlaces del menú). Las 4
familias se cargan en **`index.html`** desde Google Fonts (Anton,
Playfair Display, Space Grotesk y Ultra). Para usar otra fuente: cargarla en
`index.html` y poner su nombre en `--font-display` del tema.

### Qué cambia en cada tema

Misma información en todos lados, distinta composición por tema:

| Pieza | Archivo |
|-------|---------|
| Hero de la home (4 variantes) | `src/pages/cine/home/heroe-publico.tsx` |
| Separador de la home | `SEPARADORES` en `src/pages/cine/home/cine-home-page.tsx` (clases en `temas-publico.css`) |
| Grilla de la home | `src/pages/cine/home/grilla-publico.tsx` |
| Grilla de /peliculas (con aviso "Inactiva") | `src/pages/peliculas/grilla-peliculas.tsx` |
| Tarjetas de /cartelera (con chips de horario) | `src/pages/cartelera/tarjetas-cartelera.tsx` |
| Cabecera: nombre de los enlaces | `src/layouts/publico/enlaces.ts` (solo cambia el texto, no las rutas) |
| Pie de página (lema, horarios y colofón propios) | `src/layouts/publico/pie-publico.tsx` |

Los adornos CSS por tema (`.separador-*`, `.neon-resplandor`, `.retro-sol`,
`.tarjeta-neon`, etc.) están al final de `temas-publico.css`.

### Cambiar el tema por defecto

Editar la constante `TEMA_POR_DEFECTO` en **`src/lib/temas-publico.ts`** y
poner `'oscuro'`, `'papel'`, `'neon'` o `'retro'`.

### Vista previa sin tocar código

Agregar `?tema=` a cualquier URL pública:

```
http://localhost:5173/?tema=papel
http://localhost:5173/cartelera?tema=retro
http://localhost:5173/peliculas?tema=neon
```

### Agregar un tema nuevo

1. Copiar un bloque `.zona-publica[data-tema='...']` en `temas-publico.css`
   (hex y `--font-display`).
2. Elegirle otro nombre entre comillas simples.
3. Registrar el nombre en `TEMAS_PUBLICOS` y, si su fondo es oscuro, en
   `esTemaOscuro`, ambos en `src/lib/temas-publico.ts`.
4. Opcional: darle su propia variante en cada pieza de la tabla anterior
   (si no, cae a la de `oscuro`).
5. Si quiere otros nombres en el menú, agregar sus etiquetas en
   `ETIQUETAS` (`src/layouts/publico/enlaces.ts`).
6. Agregar su separador en `SEPARADORES` (`cine-home-page.tsx`) o reutilizar
   una clase existente.

### Alcance

- Los temas aplican solo a la **zona pública** (home, películas, cartelera,
  detalle, butacas y su cabecera/pie).
- El **panel administrativo** no cambia: su paleta sigue en
  `src/css/config.reui.css`.
- Los toasts (notificaciones) flotan fuera de la zona pública y usan la paleta
  global.
