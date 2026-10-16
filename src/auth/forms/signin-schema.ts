import { z } from 'zod';

/**
 * Validacion del formulario de acceso.
 */
export const getSigninSchema = () =>
  z.object({
    usuario: z.string().min(1, { message: 'Ingresa tu usuario' }),
    contrasena: z.string().min(1, { message: 'Ingresa tu contraseña' }),
  });

export type SigninSchemaType = z.infer<ReturnType<typeof getSigninSchema>>;
