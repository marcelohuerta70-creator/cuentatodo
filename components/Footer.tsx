import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-sm font-semibold text-zinc-300">CuentaTodo</p>
          <p className="text-xs text-zinc-500">
            Comparte historias, confesiones y factos libremente y sin registro.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
          <Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">
            Términos y Condiciones
          </Link>
          <Link href="/politica-de-privacidad" className="hover:text-white transition-colors">
            Política de Privacidad
          </Link>
        </div>
        
        <div className="text-xs text-zinc-600">
          &copy; {currentYear} CuentaTodo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
