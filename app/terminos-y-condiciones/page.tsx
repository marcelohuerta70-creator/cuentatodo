import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Términos y Condiciones - CuentaTodo',
  description: 'Reglas y lineamientos de convivencia en la plataforma CuentaTodo. Por favor léelos antes de publicar.',
};

export default function TerminosPage() {
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
            <ShieldAlert size={20} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Términos y Condiciones
          </h1>
        </div>

        <p className="text-zinc-400 text-sm mb-8">
          Última actualización: 17 de junio de 2026
        </p>

        <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
          <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-bold text-white mb-2">Resumen Importante</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              CuentaTodo es un espacio libre y abierto para compartir anécdotas, confesiones, descargos y humor de forma anónima o bajo un seudónimo. Para mantener este espacio seguro y operativo, exigimos el estricto cumplimiento de las siguientes normas.
            </p>
          </section>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Responsabilidad del Contenido</h2>
            <p className="leading-relaxed text-zinc-400">
              El usuario es **único y totalmente responsable** de cualquier contenido (publicaciones, títulos y comentarios) que envíe a la plataforma. CuentaTodo actúa únicamente como intermediario de alojamiento de contenido público y no suscribe ni respalda las opiniones publicadas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Prohibición de Datos Personales y Sensibles</h2>
            <p className="leading-relaxed text-zinc-400">
              Queda estrictamente prohibido divulgar información de identificación personal, ya sea propia o de terceros. Esto incluye, pero no se limita a:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4 text-zinc-400 space-y-1">
              <li>Nombres completos y apellidos.</li>
              <li>Números de teléfono y direcciones de correo electrónico.</li>
              <li>Direcciones particulares o de trabajo.</li>
              <li>RUT (Rol Único Tributario) o cualquier número de cédula de identidad nacional.</li>
              <li>Cuentas de redes sociales personales o de mensajería privada.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Conducta Prohibida</h2>
            <p className="leading-relaxed text-zinc-400">
              No se permitirá la publicación de:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4 text-zinc-400 space-y-1">
              <li>Amenazas de violencia, acoso sistemático u hostigamiento a personas o instituciones.</li>
              <li>Contenido ilegal, de odio, racista, homófobo o discriminatorio.</li>
              <li>Suplantación de identidad de personas reales, marcas o entidades públicas.</li>
              <li>Contenido protegido por derechos de autor o copyright sin la debida autorización de su titular.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Moderación y Derechos de Administración</h2>
            <p className="leading-relaxed text-zinc-400">
              La administración de CuentaTodo se reserva el derecho de **editar, ocultar o eliminar definitivamente** cualquier publicación o comentario que, a su exclusivo criterio, infrinja estos términos o entorpezca la experiencia de la comunidad. No se dará aviso previo al realizar estas acciones.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Cesión de Derechos de Contenido (Redistribución)</h2>
            <p className="leading-relaxed text-zinc-400">
              Al publicar contenido en CuentaTodo, el usuario otorga a la plataforma una licencia gratuita, perpetua, no exclusiva y mundial para:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4 text-zinc-400 space-y-1">
              <li>Mostrar el contenido públicamente en el sitio web.</li>
              <li>Reutilizarlo, adaptarlo, resumirlo y difundirlo en cualquiera de los canales oficiales de comunicación o marketing del proyecto (incluyendo, pero no limitado a, redes sociales como TikTok, Instagram, YouTube, Facebook, Twitter, etc.).</li>
            </ul>
            <p className="leading-relaxed text-zinc-400 mt-2">
              Dicha difusión podrá realizarse con o sin mención del nombre del autor proporcionado, y **no generará en ningún caso derecho a compensación económica** o regalía alguna para el creador del contenido original.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Modificaciones de los Términos</h2>
            <p className="leading-relaxed text-zinc-400">
              Estos términos pueden modificarse en cualquier momento y sin previo aviso para adaptarlos a nuevas regulaciones o cambios técnicos de la plataforma. El uso continuado del sitio web implica la aceptación total de las nuevas condiciones.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
