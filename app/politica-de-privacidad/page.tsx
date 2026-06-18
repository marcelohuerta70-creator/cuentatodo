import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Política de Privacidad - CuentaTodo',
  description: 'Política de privacidad de CuentaTodo, que describe cómo gestionamos los datos del usuario, el uso de cookies, Analytics y AdSense.',
};

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Eye size={20} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Política de Privacidad
          </h1>
        </div>

        <p className="text-zinc-400 text-sm mb-8">
          Última actualización: 17 de junio de 2026
        </p>

        <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
          <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-bold text-white mb-2">Preparado para el Futuro</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Esta política de privacidad detalla la recopilación y el uso de datos en nuestra plataforma y está estructurada técnicamente para cumplir con los requisitos reglamentarios de redes publicitarias como Google AdSense y herramientas de análisis web como Google Analytics.
            </p>
          </section>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Datos Recopilados</h2>
            <p className="leading-relaxed text-zinc-400">
              CuentaTodo no requiere registrarse para leer o publicar contenido. Las únicas informaciones recopiladas activamente son las que usted ingresa voluntariamente en los formularios de publicación y comentario (título, contenido, nombre opcional).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Cookies y Almacenamiento Local</h2>
            <p className="leading-relaxed text-zinc-400">
              Utilizamos cookies propias y almacenamiento local (`localStorage`) para funciones técnicas necesarias:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4 text-zinc-400 space-y-1">
              <li>**Control de Spam**: Guardamos marcas de tiempo locales para aplicar límites de tiempo (cooldown) entre envíos y proteger el servidor.</li>
              <li>**Preferencias**: Almacenar su preferencia sobre publicar como anónimo.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Integraciones de Terceros (Analytics y Publicidad)</h2>
            <p className="leading-relaxed text-zinc-400">
              Para financiar y mejorar el servicio, este sitio web está preparado para integrar herramientas de terceros que pueden recopilar datos anónimos de navegación:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4 text-zinc-400 space-y-3">
              <li>
                <strong>Google Analytics:</strong> Herramienta que utiliza cookies para analizar cómo interactúan los usuarios con el sitio. Los datos recopilados (como dirección IP truncada, navegador, páginas visitadas) son puramente estadísticos y no identifican al usuario.
              </li>
              <li>
                <strong>Google AdSense:</strong> Proveedores externos, incluido Google, utilizan cookies para mostrar anuncios basados en las visitas anteriores que un usuario realiza en este sitio web u otros sitios web. Los usuarios pueden inhabilitar la publicidad personalizada a través de las Preferencias de anuncios de Google.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Seguridad de los Datos</h2>
            <p className="leading-relaxed text-zinc-400">
              Nos comprometemos a proteger la integridad de los datos de la plataforma. Sin embargo, dado que CuentaTodo es una plataforma de publicación pública y abierta, cualquier dato personal que usted escriba en una publicación o comentario será visible para todo el mundo. **Le pedimos encarecidamente que no publique datos privados**.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Derechos sobre la Información</h2>
            <p className="leading-relaxed text-zinc-400">
              Si ha publicado por error información confidencial y desea retirarla, puede contactar al equipo de administración del sitio web aportando los detalles específicos de la publicación para proceder con su eliminación o edición preventiva.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
