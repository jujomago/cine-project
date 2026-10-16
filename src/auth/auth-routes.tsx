import { RouteObject } from 'react-router-dom';
import { BrandedLayout } from './layouts/branded';
import { SignInPage } from './pages/signin-page';
import { SignUpPage } from './pages/signup-page';
/**
 * Rutas publicas de acceso, montadas en /auth/*.
 *
 * Inicio de sesion y registro de cuenta. Recuperacion de contrasena todavia
 * no existe.
 */
export const authRoutes: RouteObject[] = [
  {
    path: '',
    element: <BrandedLayout />,
    children: [
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
    ],
  },
];
