'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Send, Clock, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MOCK_EMOJIS_ACCENTS } from '@/utils/mockData';
import { validateContent } from '@/utils/validation';
import { getCooldownStatus, setCooldown } from '@/utils/cooldown';
import { getCategoriaBySlug } from '@/services/categorias.service';
import { getPublicacionesByCategoria, crearPublicacion } from '@/services/publicaciones.service';
import { Categoria, PublicacionConDetalles, Publicacion } from '@/types';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { categorySlug } = React.use(params);

  // States
  const [category, setCategory] = React.useState<Categoria | null>(null);
  const [posts, setPosts] = React.useState<PublicacionConDetalles[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Form States
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [authorName, setAuthorName] = React.useState('');
  const [isAnonymous, setIsAnonymous] = React.useState(true);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load data on mount
  React.useEffect(() => {
    loadCategoryData();
    checkCooldown();
    const timer = setInterval(checkCooldown, 1000);
    return () => clearInterval(timer);
  }, [categorySlug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const cat = await getCategoriaBySlug(categorySlug);

      if (!cat) {
        notFound();
        return;
      }

      setCategory(cat);
      const publications = await getPublicacionesByCategoria(cat.id);
      setPosts(publications);
    } catch (err) {
      setError('Error cargando la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkCooldown = () => {
    const status = getCooldownStatus('post', 600);
    if (status.isBlocked) {
      setCooldownTime(status.remainingSeconds);
    } else {
      setCooldownTime(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones
    const cooldown = getCooldownStatus('post', 600);
    if (cooldown.isBlocked) {
      setErrorMsg(`Debes esperar ${Math.ceil(cooldown.remainingSeconds / 60)} minutos antes de publicar de nuevo.`);
      return;
    }

    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg('El título debe tener al menos 5 caracteres.');
      return;
    }

    if (!content.trim() || content.trim().length < 10) {
      setErrorMsg('El contenido debe tener al menos 10 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los términos y condiciones.');
      return;
    }

    // Validar contenido (sin IA, solo programación)
    const titleValidation = validateContent(title, 'El título');
    if (!titleValidation.isValid) {
      setErrorMsg(titleValidation.error || 'Título no válido.');
      return;
    }

    const contentValidation = validateContent(content, 'El contenido');
    if (!contentValidation.isValid) {
      setErrorMsg(contentValidation.error || 'Contenido no válido.');
      return;
    }

    if (authorName && !isAnonymous) {
      const nameValidation = validateContent(authorName, 'El nombre');
      if (!nameValidation.isValid) {
        setErrorMsg(nameValidation.error || 'Nombre no válido.');
        return;
      }
    }

    // Crear publicación
    try {
      setIsSubmitting(true);

      if (!category) {
        setErrorMsg('Error: categoría no encontrada.');
        return;
      }

      // Generar slug
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const newPost: Omit<Publicacion, 'id' | 'fecha'> = {
        categoria_id: category.id,
        titulo: title,
        contenido: content,
        nombre: isAnonymous ? null : authorName || null,
        anonimo: isAnonymous,
        slug,
      };

      const created = await crearPublicacion(newPost);

      if (created) {
        // Establecer cooldown
        setCooldown('post');

        // Limpiar formulario
        setTitle('');
        setContent('');
        setAuthorName('');
        setIsAnonymous(true);
        setAcceptTerms(false);

        // Recargar publicaciones
        await loadCategoryData();
      } else {
        setErrorMsg('Error al crear la publicación. Intenta de nuevo.');
      }
    } catch (err) {
      setErrorMsg('Error al crear la publicación.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Cargando categoría...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return notFound();
  }

  const styles = MOCK_EMOJIS_ACCENTS[category.slug] || {
    border: 'border-zinc-800',
    text: 'text-zinc-300',
    bg: 'bg-zinc-900/50',
    shadow: 'shadow-black/50',
  };

  const emoji = category.nombre.split(' ')[0];
  const titleText = category.nombre.replace(emoji, '').trim();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs items={[{ label: category.nombre, url: `/${category.slug}` }]} />

        {/* Category Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Volver</span>
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{emoji}</div>
            <div>
              <h1 className="text-4xl font-bold text-white">{titleText}</h1>
              <p className="text-zinc-400 mt-2">{category.descripcion}</p>
            </div>
          </div>
        </div>

        {/* TODO: Publicidad - AdSense Leaderboard */}
        {/* <div className="w-full mb-8">
          <AdBanner slot="category-top-leaderboard" type="leaderboard" />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sticky top-20">
              <h2 className="text-lg font-bold text-white mb-6">Comparte tu historia</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    disabled={isAnonymous}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 cursor-pointer"
                  />
                  <span className="text-sm text-zinc-400">Publicar anónimo</span>
                </label>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    placeholder="Títu lo de tu publicación"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Contenido
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                    placeholder="Escribe tu historia..."
                    rows={5}
                  />
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 cursor-pointer mt-1"
                  />
                  <span className="text-xs text-zinc-400">
                    Acepto los{' '}
                    <Link href="/terminos-y-condiciones" className="text-white hover:underline">
                      términos
                    </Link>
                    {' '}y{' '}
                    <Link href="/politica-de-privacidad" className="text-white hover:underline">
                      privacidad
                    </Link>
                  </span>
                </label>

                {/* Cooldown Warning */}
                {cooldownTime > 0 && (
                  <div className="text-xs text-zinc-500 text-center">
                    Espera {Math.ceil(cooldownTime / 60)} min para publicar de nuevo
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!acceptTerms || isSubmitting || cooldownTime > 0}
                  className="w-full px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
              </form>
            </div>

            {/* TODO: Publicidad - AdSense Rectangle (300x250) */}
            {/* <div className="mt-6">
              <AdBanner slot="category-sidebar-ad" type="rectangle" />
            </div> */}
          </div>

          {/* Posts Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">
                Publicaciones ({posts.length})
              </h2>
            </div>

            {posts.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center">
                <p className="text-zinc-500">No hay publicaciones aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${category.slug}/${post.slug}`}
                    className="block p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
                  >
                    <h3 className="font-semibold text-white mb-2">{post.titulo}</h3>
                    <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{post.contenido}</p>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{post.anonimo ? 'Anónimo' : post.nombre || 'Anónimo'}</span>
                      <span>{new Date(post.fecha).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-6 mt-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> {post.comentarios_count}
                      </span>
                      <span>👍 {post.total_reacciones}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
