'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Trash2, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Publicacion, Categoria } from '@/types';

interface PublicacionConCategoria extends Publicacion {
  categoria?: Categoria;
}

export default function AdminPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = React.useState<string | null>(null);
  const [publicaciones, setPublicaciones] = React.useState<PublicacionConCategoria[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    const email = localStorage.getItem('admin_email');
    if (!email) {
      router.push('/admin/login');
      return;
    }

    setAdminEmail(email);
    loadPublicaciones();
  }, [router]);

  const loadPublicaciones = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        console.error('Supabase not initialized');
        return;
      }

      const { data: pubsData, error } = await supabase
        .from('publicaciones')
        .select(`
          id,
          categoria_id,
          titulo,
          contenido,
          nombre,
          anonimo,
          slug,
          fecha
        `)
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error loading publications:', error);
        return;
      }

      // Cargar categorías
      if (pubsData && pubsData.length > 0) {
        const catIds = [...new Set(pubsData.map(p => p.categoria_id))];
        const { data: catsData } = await supabase
          .from('categorias')
          .select('id, nombre, slug')
          .in('id', catIds);

        const pubsConCats = pubsData.map(pub => ({
          ...pub,
          categoria: catsData?.find(c => c.id === pub.categoria_id),
        }));

        setPublicaciones(pubsConCats as PublicacionConCategoria[]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePublicacion = async (pubId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    try {
      setDeleting(pubId);

      if (!supabase) {
        alert('Error: Supabase no está configurado');
        return;
      }

      const { error } = await supabase
        .from('publicaciones')
        .delete()
        .eq('id', pubId);

      if (error) {
        alert('Error al eliminar');
        console.error(error);
      } else {
        setPublicaciones(publicaciones.filter(p => p.id !== pubId));
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
            <h1 className="text-3xl font-bold text-white">Panel de Moderación</h1>
            <p className="text-zinc-400 mt-1">Administra el contenido de CuentaTodo</p>
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
              <FileText size={24} className="text-amber-400" />
              <div>
                <p className="text-zinc-400 text-sm">Total de publicaciones</p>
                <p className="text-2xl font-bold text-white">{publicaciones.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div>
              <p className="text-zinc-400 text-sm mb-2">Última actualización</p>
              <p className="text-sm text-zinc-300">
                {publicaciones.length > 0
                  ? new Date(publicaciones[0].fecha).toLocaleDateString()
                  : 'Sin publicaciones'}
              </p>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Publicaciones a Moderar</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-zinc-400">Cargando publicaciones...</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400">No hay publicaciones</p>
            </div>
          ) : (
            publicaciones.map((pub) => (
              <div
                key={pub.id}
                className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300 font-medium">
                        {pub.categoria?.nombre || 'Categoría desconocida'}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(pub.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{pub.titulo}</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-3">{pub.contenido}</p>
                    <p className="text-xs text-zinc-500">
                      Por: {pub.anonimo ? 'Anónimo' : pub.nombre || 'Anónimo'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pub.categoria && (
                    <Link
                      href={`/${pub.categoria.slug}/${pub.slug}`}
                      className="text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      Ver en la app →
                    </Link>
                  )}
                  <button
                    onClick={() => handleDeletePublicacion(pub.id)}
                    disabled={deleting === pub.id}
                    className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    {deleting === pub.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
