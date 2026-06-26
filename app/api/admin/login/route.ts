import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Autenticar con Supabase
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Error en autenticación' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      email: authData.user.email,
      session: authData.session?.access_token,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
