import { supabase } from '@/lib/supabase';
import { Categoria } from '@/types';

export async function getAllCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function getCategoriaBySlug(slug: string): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}
