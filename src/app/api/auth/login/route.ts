import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic'; // Esto fuerza el modo dinámico


export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Buscar usuario en la base de datos
    const user = await prisma.tb_personal.findUnique({
      where: { pro_codper: username },
      include: { 
        tb_roles: true // Usa el nombre EXACTO de la relación como está en el modelo
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // 2. Verificar contraseña (asumiendo que pro_conper almacena hash)
    const passwordMatch = await bcrypt.compare(password, user.pro_conper || '');

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // 3. Crear payload del JWT
    const payload = {
      userId: user.pro_codper,
      name: `${user.pro_nomper}`,
      role: user.pro_rolper,
      permissions: {
        dashboard: user.tb_roles?.dashboard || false,
        production: user.tb_roles?.production || false,
        suppliers: user.tb_roles?.suppliers || false,
        transport: user.tb_roles?.transport || false,
        config: user.tb_roles?.config || false
      }
    };

    // 4. Generar token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '8h'
    });


    // 5. Crear respuesta con cookie HTTP-only
    const response = NextResponse.json({
      user: {
        id: user.pro_codper,
        name: `${user.pro_nomper}`,
        role: user.pro_rolper,
        permissions: payload.permissions
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 horas
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}