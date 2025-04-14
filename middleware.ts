import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/auth/login', '/auth/register'];
  
  try {
    // Si es una ruta pública
    if (publicPaths.includes(pathname)) {
      // Si tiene token válido, redirigir a la página principal
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string;
          permissions: Record<string, boolean>;
        };
        return NextResponse.redirect(new URL('/', request.url));
      }
      // Si no tiene token, permitir acceso
      return NextResponse.next();
    }

    // Para rutas protegidas
    if (!token) throw new Error('No token provided');

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      permissions: Record<string, boolean>;
    };

    // Redirigir según permisos
    if (pathname.startsWith('/dashboard') && !decoded.permissions.dashboard) {
      return NextResponse.redirect(new URL('/production', request.url));
    }

    if (pathname.startsWith('/config') && !decoded.permissions.config) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Solo redirigir a login si es una ruta protegida
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};