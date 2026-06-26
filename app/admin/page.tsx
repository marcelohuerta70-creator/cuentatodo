'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Trash2, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Publicacion, Categoria, Comentario } from '@/types';

interface PublicacionConComentarios extends Publicacion {
  comentarios?: Comentario[];
}

interface CategoriaConPublicaciones extends Categoria {
  publicaciones?: PublicacionConComentarios[];
}

export default function AdminPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = React.useState<string | null>(null);
  const [categorias, setCategorias] = React.useState<CategoriaConPublicaciones[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedCats, setExpandedCats] = React.useState<Set<string>>(new Set());
  const [expandedPubs, setExpandedPubs] = React.useState<Set<string>>(new Set());
  const [deleting, setDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    const email = localStorage.getItem('admin_email');
    if (!email) {
      router.push('/admin/login');
      return;
    }

    setAdminEmail(email);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        console.error('Supabase not initialized');
        return;
      }

      // Cargar categorías
      const { data: catsData } = await supabase
        .from('categorias')
        .select('*')
        .order('created_at', { ascending: true });

      if (!catsData) return;

      // Para cada categoría, cargar publicaciones
      const catsConPubs = await Promise.all(
        catsData.map(async (cat) => {
          if (!supabase) return { ...cat, publicaciones: [] };

          const { data: pubsData } = await supabase
            .from('publicaciones')
            .select('*')
            .eq('categoria_id', cat.id)
            .order('fecha', { ascending: false });

          return {
            ...cat,
            publicaciones: pubsData || [],
          };
        })
      );

      setCategorias(catsConPubs as CategoriaConPublicaciones[]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComentarios = async (pubId: string) => {
    if (!supabase) return;

    const { data: comentariosData } = await supabase
      .from('comentarios')
      .select('*')
      .eq('publicacion_id', pubId)
      .order('fecha', { ascending: true });

    // Actualizar el estado
    setCategorias((prevCats) =>
      prevCats.map((cat) => ({
        ...cat,
        publicaciones: cat.publicaciones?.map((pub) =>
          pub.id === pubId ? { ...pub, comentarios: comentariosData || [] } : pub
        ),
      }))
    );
  };

  const toggleCategory = (catId: string) => {
    const newExpanded = new Set(expandedCats);
    if (newExpanded.has(catId)) {
      newExpanded.delete(catId);
    } else {
      newExpanded.add(catId);
    }
    setExpandedCats(newExpanded);
  };

  const togglePublication = (pubId: string) => {
    const newExpanded = new Set(expandedPubs);
    if (newExpanded.has(pubId)) {
      newExpanded.delete(pubId);
    } else {
      newExpanded.add(pubId);
      loadComentarios(pubId);
    }
    setExpandedPubs(newExpanded);
  };

  const handleDeletePublicacion = async (pubId: string) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;

    try {
      setDeleting(pubId);
      if (!supabase) return;

      await supabase.from('publicaciones').delete().eq('id', pubId);

      setCategorias((prevCats) =>
        prevCats.map((cat) => ({
          ...cat,
          publicaciones: cat.publicaciones?.filter((p) => p.id !== pubId),
        }))
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteComentario = async (comId: string, pubId: string) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;

    try {
      setDeleting(comId);
      if (!supabase) return;

      await supabase.from('comentarios').delete().eq('id', comId);

      setCategorias((prevCats) =>
        prevCats.map((cat) => ({
          ...cat,
          publicaciones: cat.publicaciones?.map((pub) =>
            pub.id === pubId
              ? {
                  ...pub,
                  comentarios: pub.comentarios?.filter((c) => c.id !== comId),
                }
              : pub
          ),
        }))
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  if (!adminEmail) return null;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Moderación</h1>
            <p className="text-zinc-400 mt-1">Gestiona publicaciones y comentarios</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-zinc-400">Cargando...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categorias.map((cat) => (
              <div key={cat.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                {/* Categoría */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-900/70 transition text-left"
                >
                  {expandedCats.has(cat.id) ? (
                    <ChevronDown size={20} className="text-amber-400" />
                  ) : (
                    <ChevronRight size={20} className="text-zinc-500" />
                  )}
                  <span className="font-bold text-white flex-1">{cat.nombre}</span>
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                    {cat.publicaciones?.length || 0} publs
                  </span>
                </button>

                {/* Publicaciones */}
                {expandedCats.has(cat.id) && (
                  <div className="border-t border-zinc-800 bg-zinc-950/50 space-y-2 p-4">
                    {(!cat.publicaciones || cat.publicaciones.length === 0) ? (
                      <p className="text-zinc-500 text-sm">Sin publicaciones</p>
                    ) : (
                      cat.publicaciones.map((pub) => (
                        <div key={pub.id} className="border border-zinc-800 rounded bg-zinc-900/50">
                          {/* Publicación */}
                          <button
                            onClick={() => togglePublication(pub.id)}
                            className="w-full flex items-start gap-3 p-3 hover:bg-zinc-900 transition text-left"
                          >
                            {expandedPubs.has(pub.id) ? (
                              <ChevronDown size={18} className="text-amber-400 mt-1 flex-shrink-0" />
                            ) : (
                              <ChevronRight size={18} className="text-zinc-500 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white truncate">{pub.titulo}</h4>
                              <p className="text-xs text-zinc-500 mt-1">
                                {pub.anonimo ? 'Anónimo' : pub.nombre || 'Anónimo'}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePublicacion(pub.id);
                              }}
                              disabled={deleting === pub.id}
                              className="flex-shrink-0 p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </button>

                          {/* Comentarios */}
                          {expandedPubs.has(pub.id) && (
                            <div className="border-t border-zinc-800 bg-zinc-950 p-3 space-y-2">
                              {!pub.comentarios || pub.comentarios.length === 0 ? (
                                <p className="text-zinc-600 text-xs">Sin comentarios</p>
                              ) : (
                                pub.comentarios.map((com) => (
                                  <div
                                    key={com.id}
                                    className="bg-zinc-800/50 p-2 rounded flex items-start gap-2 group"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-zinc-300">
                                        {com.nombre || 'Anónimo'}
                                      </p>
                                      <p className="text-xs text-zinc-400 mt-1 break-words">
                                        {com.comentario}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteComentario(com.id, pub.id)}
                                      disabled={deleting === com.id}
                                      className="flex-shrink-0 p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
