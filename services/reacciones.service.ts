import { supabase } from '@/lib/supabase';
import { Reaccion } from '@/types';

export async function getReaccionesByPublicacion(
  publicacionId: string
): Promise<Reaccion[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('reacciones')
    .select('*')
    .eq('publicacion_id', publicacionId);

  if (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }

  return data || [];
}

export async function crearReaccion(
  input: Omit<Reaccion, 'id' | 'fecha'>
): Promise<Reaccion | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('reacciones')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating reaction:', error);
    return null;
  }

  return data;
}

export async function getReaccionesCount(
  publicacionId: string
): Promise<Record<string, number>> {
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('reacciones')
    .select('tipo')
    .eq('publicacion_id', publicacionId);

  if (error) {
    console.error('Error counting reactions:', error);
    return {};
  }

  const count: Record<string, number> = {};

  (data || []).forEach((reaccion) => {
    count[reaccion.tipo] = (count[reaccion.tipo] || 0) + 1;
  });

  return count;
}
