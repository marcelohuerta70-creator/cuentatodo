'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      // Guardar sesión en localStorage
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_session', data.session || '');
      router.push('/admin');
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center justify-center">
        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Panel Admin</h1>
          <p className="text-zinc-400 text-sm mb-6">Inicia sesión para moderar comentarios</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Iniciando sesión...' : 'Inicia sesión'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
