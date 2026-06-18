'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MOCK_EMOJIS_ACCENTS } from '@/utils/mockData';
import { validateContent } from '@/utils/validation';
import { getCooldownStatus, setCooldown } from '@/utils/cooldown';
import { getCategoriaBySlug } from '@/services/categorias.service';
import { getPublicacionBySlug, crearPublicacion } from '@/services/publicaciones.service';
import { getComentariosByPublicacion, crearComentario } from '@/services/comentarios.service';
import { crearReaccion, getReaccionesCount } from '@/services/reacciones.service';
import { Categoria, PublicacionConDetalles, Comentario } from '@/types';

interface PageProps {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export default function PostPage({ params }: PageProps) {
  const { categorySlug, postSlug } = React.use(params);

  // States
  const [category, setCategory] = React.useState<Categoria | null>(null);
  const [post, setPost] = React.useState<PublicacionConDetalles | null>(null);
  const [comments, setComments] = React.useState<Comentario[]>([]);
  const [reactionCounts, setReactionCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);

  // Form States
  const [commentName, setCommentName] = React.useState('');
  const [commentText, setCommentText] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load data on mount
  React.useEffect(() => {
    loadPostData();
  }, [categorySlug, postSlug]);

  const loadPostData = async () => {
    try {
      setLoading(true);

      // Cargar categoría
      const cat = await getCategoriaBySlug(categorySlug);
      if (!cat) {
        notFound();
        return;
      }
      setCategory(cat);

      // Cargar publicación
      const publication = await getPublicacionBySlug(postSlug);
      if (!publication) {
        notFound();
        return;
      }
      setPost(publication);

      // Cargar comentarios
      const comms = await getComentariosByPublicacion(publication.id);
      setComments(comms);

      // Cargar reacciones
      const reactions = await getReaccionesCount(publication.id);
      setReactionCounts(reactions);
    } catch (err) {
      console.error('Error loading post:', err);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!commentText.trim() || commentText.trim().length < 3) {
      setErrorMsg('El comentario debe tener al menos 3 caracteres.');
      return;
    }

    const validation = validateContent(commentText, 'El comentario');
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Comentario no válido.');
      return;
    }

    if (commentName && commentName.trim()) {
      const nameValidation = validateContent(commentName, 'El nombre');
      if (!nameValidation.isValid) {
        setErrorMsg(nameValidation.error || 'Nombre no válido.');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (!post) {
        setErrorMsg('Error: publicación no encontrada.');
        return;
      }

      const newComment = await crearComentario({
        publicacion_id: post.id,
        nombre: commentName || null,
        comentario: commentText,
      });

      if (newComment) {
        setCommentName('');
        setCommentText('');
        setSuccessMsg('¡Comentario publicado!');
        setTimeout(() => setSuccessMsg(null), 3000);
        await loadPostData();
      } else {
        setErrorMsg('Error al publicar comentario.');
      }
    } catch (err) {
      setErrorMsg('Error al publicar comentario.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReaction = async (type: string) => {
    try {
      if (!post) return;

      // Cooldown de 5 minutos por tipo de reacción (silencioso)
      const cooldownKey = `reaction-${post.id}-${type}`;
      const cooldown = getCooldownStatus(cooldownKey, 300);

      if (cooldown.isBlocked) {
        return; // No hacer nada, cooldown silencioso
      }

      await crearReaccion({
        publicacion_id: post.id,
        tipo: type,
      });

      setCooldown(cooldownKey);
      const reactions = await getReaccionesCount(post.id);
      setReactionCounts(reactions);
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (!category || !post) {
    return notFound();
  }

  const emoji = category.nombre.split(' ')[0];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs items={[
          { label: category.nombre, url: `/${category.slug}` },
          { label: post.titulo }
        ]} />

        <Link href={`/${categorySlug}`} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Volver a {category.nombre}</span>
        </Link>

        {/* TODO: Publicidad - AdSense Leaderboard */}
        {/* <div className="w-full mb-8">
          <AdBanner slot="post-top-leaderboard" type="leaderboard" />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Post Content */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">{post.titulo}</h1>
              <div className="flex items-center justify-between text-sm text-zinc-500 mb-8 pb-8 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                  <span>{post.anonimo ? 'Anónimo' : post.nombre || 'Anónimo'}</span>
                  <span>•</span>
                  <span>{new Date(post.fecha).toLocaleDateString()}</span>
                </div>
                <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs">{emoji} {category.nombre}</span>
              </div>

              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">{post.contenido}</p>
              </div>

              {/* Reactions */}
              <div className="flex gap-3 mb-12 pb-12 border-b border-zinc-800">
                <button
                  onClick={() => handleAddReaction('👍')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition flex items-center gap-2"
                >
                  👍 {reactionCounts['👍'] || 0}
                </button>
                <button
                  onClick={() => handleAddReaction('❤️')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition flex items-center gap-2"
                >
                  ❤️ {reactionCounts['❤️'] || 0}
                </button>
                <button
                  onClick={() => handleAddReaction('😂')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition flex items-center gap-2"
                >
                  😂 {reactionCounts['😂'] || 0}
                </button>
                <button
                  onClick={() => handleAddReaction('😮')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm transition flex items-center gap-2"
                >
                  😮 {reactionCounts['😮'] || 0}
                </button>
              </div>

              {/* Comments Section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Comentarios ({comments.length})</h2>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  {successMsg && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                      {successMsg}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Nombre (opcional)
                    </label>
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Comentario
                    </label>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                      placeholder="Escribe tu comentario..."
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {isSubmitting ? 'Publicando...' : 'Enviar'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-zinc-500">Sé el primero en comentar</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">
                            {comment.nombre || 'Anónimo'}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(comment.fecha).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-zinc-300 text-sm">{comment.comentario}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* TODO: Publicidad - AdSense Rectangle (300x250) */}
            {/* <div>
              <AdBanner slot="post-sidebar-ad" type="rectangle" />
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
