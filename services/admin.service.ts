import { supabase } from '@/lib/supabase';

export async function deleteComentario(comentarioId: string): Promise<boolean> {
  const { error } = await supabase
    .from('comentarios')
    .delete()
    .eq('id', comentarioId);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}

export async function isAdmin(email: string): Promise<boolean> {
  const { data, error } = await (supabase as any)
    .from('admins')
    .select('email')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return !!data;
}
