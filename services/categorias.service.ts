import { supabase } from '@/lib/supabase';
import { Categoria } from '@/types';

export async function getAllCategorias(): Promise<Categoria[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return [];
    }

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error fetching categories:', error);
      return [];
    }

    if (!data) {
      console.warn('No data returned from categories query');
      return [];
    }

    return data;
  } catch (err) {
    console.error('Exception in getAllCategorias:', err);
    return [];
  }
}

export async function getCategoriaBySlug(slug: string): Promise<Categoria | null> {
  try {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return null;
    }

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Supabase error fetching category:', error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error('Exception in getCategoriaBySlug:', err);
    return null;
  }
}
