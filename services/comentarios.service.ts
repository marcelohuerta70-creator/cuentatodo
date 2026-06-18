import { supabase } from '@/lib/supabase';
import { Comentario } from '@/types';

export async function getComentariosByPublicacion(
  publicacionId: string
): Promise<Comentario[]> {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .eq('publicacion_id', publicacionId)
    .order('fecha', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

export async function crearComentario(
  input: Omit<Comentario, 'id' | 'fecha'>
): Promise<Comentario | null> {
  const { data, error } = await supabase
    .from('comentarios')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data;
}
