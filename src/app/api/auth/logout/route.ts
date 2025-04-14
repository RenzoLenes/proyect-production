import { NextResponse } from "next/server";


export async function POST() {

    const response = NextResponse.json(
        { sucess: true, message: 'Logout successful' },
        { status: 200 }
    )


    response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Eliminar cookie
        path: '/'
    })

    return response;


}