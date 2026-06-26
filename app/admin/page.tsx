'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Trash2, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Comentario, Publicacion } from '@/types';

interface ComentarioConPublicacion extends Comentario {
  publicacion?: Publicacion;
}

export default function AdminPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = React.useState<string | null>(null);
  const [comentarios, setComentarios] = React.useState<ComentarioConPublicacion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending'>('all');

  React.useEffect(() => {
    const email = localStorage.getItem('admin_email');
    if (!email) {
      router.push('/admin/login');
      return;
    }

    setAdminEmail(email);
    loadComentarios();
  }, [router]);

  const loadComentarios = async () => {
    try {
      setLoading(true);
      const { data: comentariosData, error } = await supabase
        .from('comentarios')
        .select(`
          id,
          publicacion_id,
          nombre,
          comentario,
          fecha
        `)
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      // Cargar publicaciones para mostrar contexto
      if (comentariosData && comentariosData.length > 0) {
        const pubIds = [...new Set(comentariosData.map(c => c.publicacion_id))];
        const { data: pubsData } = await supabase
          .from('publicaciones')
          .select('id, titulo, slug, categoria_id')
          .in('id', pubIds);

        const comentariosConPubs = comentariosData.map(c => ({
          ...c,
          publicacion: pubsData?.find(p => p.id === c.publicacion_id),
        }));

        setComentarios(comentariosConPubs as ComentarioConPublicacion[]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComentario = async (comentarioId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return;
    }

    try {
      setDeleting(comentarioId);
      const response = await fetch('/api/admin/delete-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentarioId, email: adminEmail }),
      });

      if (response.ok) {
        setComentarios(comentarios.filter(c => c.id !== comentarioId));
      } else {
        alert('Error al eliminar comentario');
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  if (!adminEmail) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel Admin</h1>
            <p className="text-zinc-400 mt-1">Bienvenido, {adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare size={24} className="text-amber-400" />
              <div>
                <p className="text-zinc-400 text-sm">Total de comentarios</p>
                <p className="text-2xl font-bold text-white">{comentarios.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div>
              <p className="text-zinc-400 text-sm mb-2">Filtrar por:</p>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              >
                <option value="all">Todos los comentarios</option>
                <option value="pending">Pendientes de revisión</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Comentarios</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-zinc-400">Cargando comentarios...</p>
            </div>
          ) : comentarios.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400">No hay comentarios</p>
            </div>
          ) : (
            comentarios.map((comentario) => (
              <div
                key={comentario.id}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {comentario.publicacion?.titulo || 'Publicación eliminada'}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Por: {comentario.nombre || 'Anónimo'} •{' '}
                      {new Date(comentario.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  {comentario.publicacion && (
                    <Link
                      href={`/${comentario.publicacion.categoria_id}/${comentario.publicacion.slug}`}
                      className="text-xs text-amber-400 hover:text-amber-300 transition ml-4"
                    >
                      Ver publicación →
                    </Link>
                  )}
                </div>

                <p className="text-zinc-300 mb-4 leading-relaxed">{comentario.comentario}</p>

                <button
                  onClick={() => handleDeleteComentario(comentario.id)}
                  disabled={deleting === comentario.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  {deleting === comentario.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
