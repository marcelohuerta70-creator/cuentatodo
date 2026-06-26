import { supabase } from '@/lib/supabase';
import { Publicacion, PublicacionConDetalles } from '@/types';

export async function getPublicacionesByCategoria(
  categoriaId: string
): Promise<PublicacionConDetalles[]> {
  if (!supabase) return [];

  const { data: publicaciones, error } = await supabase
    .from('publicaciones')
    .select('*')
    .eq('categoria_id', categoriaId)
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error fetching publications:', error);
    return [];
  }

  // Enrich with comment and reaction counts
  const enriquecidas = await Promise.all(
    (publicaciones || []).map(async (pub) => {
      const comentarios_count = await getComentariosCount(pub.id);
      const reacciones = await getReaccionesCount(pub.id);

      return {
        ...pub,
        comentarios_count,
        reacciones_count: reacciones.count,
        total_reacciones: reacciones.total,
      };
    })
  );

  return enriquecidas;
}

export async function getPublicacionBySlug(slug: string): Promise<PublicacionConDetalles | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('publicaciones')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching publication:', error);
    return null;
  }

  if (!data) return null;

  const comentarios_count = await getComentariosCount(data.id);
  const reacciones = await getReaccionesCount(data.id);

  return {
    ...data,
    comentarios_count,
    reacciones_count: reacciones.count,
    total_reacciones: reacciones.total,
  };
}

export async function getUltimasPublicaciones(
  limit: number = 3
): Promise<PublicacionConDetalles[]> {
  if (!supabase) return [];

  const { data: publicaciones, error } = await supabase
    .from('publicaciones')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest publications:', error);
    return [];
  }

  const enriquecidas = await Promise.all(
    (publicaciones || []).map(async (pub) => {
      const comentarios_count = await getComentariosCount(pub.id);
      const reacciones = await getReaccionesCount(pub.id);

      return {
        ...pub,
        comentarios_count,
        reacciones_count: reacciones.count,
        total_reacciones: reacciones.total,
      };
    })
  );

  return enriquecidas;
}

export async function crearPublicacion(
  input: Omit<Publicacion, 'id' | 'fecha'>
): Promise<Publicacion | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('publicaciones')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating publication:', error);
    return null;
  }

  return data;
}

async function getComentariosCount(publicacionId: string): Promise<number> {
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from('comentarios')
    .select('*', { count: 'exact', head: true })
    .eq('publicacion_id', publicacionId);

  if (error) {
    console.error('Error counting comments:', error);
    return 0;
  }

  return count || 0;
}

async function getReaccionesCount(
  publicacionId: string
): Promise<{ count: Record<string, number>; total: number }> {
  if (!supabase) return { count: {}, total: 0 };

  const { data, error } = await supabase
    .from('reacciones')
    .select('tipo')
    .eq('publicacion_id', publicacionId);

  if (error) {
    console.error('Error counting reactions:', error);
    return { count: {}, total: 0 };
  }

  const count: Record<string, number> = {};
  let total = 0;

  (data || []).forEach((reaccion) => {
    count[reaccion.tipo] = (count[reaccion.tipo] || 0) + 1;
    total++;
  });

  return { count, total };
}
