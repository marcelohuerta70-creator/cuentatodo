import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { comentarioId, email } = await request.json();

    if (!comentarioId || !email) {
      return NextResponse.json(
        { error: 'Faltan parámetros' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verificar que sea admin
    const { data: adminData } = await (supabase
      .from('admins') as any)
      .select('email')
      .eq('email', email)
      .single();

    if (!adminData) {
      return NextResponse.json(
        { error: 'No tienes permisos' },
        { status: 403 }
      );
    }

    // Eliminar comentario
    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', comentarioId);

    if (error) {
      return NextResponse.json(
        { error: 'Error al eliminar' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
