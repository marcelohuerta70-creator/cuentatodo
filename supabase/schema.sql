-- ====================================================================
-- CUENTATODO DATABASE SCHEMA
-- Execute this script in the Supabase SQL Editor.
-- ====================================================================

-- 1. CLEANUP (Optional - only for clean state reset)
DROP TABLE IF EXISTS reacciones CASCADE;
DROP TABLE IF EXISTS comentarios CASCADE;
DROP TABLE IF EXISTS publicaciones CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;

-- 2. CREATE TABLES

-- Categories table
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Publications table
CREATE TABLE publicaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  nombre VARCHAR(100),
  anonimo BOOLEAN NOT NULL DEFAULT false,
  slug VARCHAR(255) UNIQUE NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments table
CREATE TABLE comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publicacion_id UUID NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
  nombre VARCHAR(100),
  comentario TEXT NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reactions table
CREATE TABLE reacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publicacion_id UUID NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- e.g., 'like', 'love', 'funny', 'wow'
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_publicaciones_categoria ON publicaciones(categoria_id);
CREATE INDEX idx_publicaciones_slug ON publicaciones(slug);
CREATE INDEX idx_comentarios_publicacion ON comentarios(publicacion_id);
CREATE INDEX idx_reacciones_publicacion ON reacciones(publicacion_id);
CREATE INDEX idx_reacciones_publicacion_tipo ON reacciones(publicacion_id, tipo);

-- 4. SEED INITIAL CATEGORIES
INSERT INTO categorias (nombre, slug, descripcion) VALUES
  ('😂 Chistes', 'chistes', 'Comparte tus mejores chistes y sácale una sonrisa a la comunidad.'),
  ('🤫 Confesiones', 'confesiones', 'Saca a la luz tus secretos mejor guardados de forma totalmente anónima.'),
  ('📖 Historias', 'historias', 'Cuéntanos anécdotas, relatos o historias largas que merezcan ser leídas.'),
  ('👀 Chismes', 'chismes', 'El rincón del drama, rumores e intrigas del momento.'),
  ('🗣 Descargos', 'descargos', 'Desahógate y suelta toda la frustración sobre el trabajo, estudios o la vida misma.'),
  ('💡 Factos', 'factos', 'Verdades que duelen, opiniones impopulares o verdades absolutas de la vida.'),
  ('🚩 Red Flags', 'red-flags', 'Alertas y comportamientos sospechosos que has notado en personas o situaciones.'),
  ('🟢 Green Flags', 'green-flags', 'Cosas bonitas, sanas y positivas que demuestran que alguien vale la pena.'),
  ('👻 Paranormal', 'paranormal', 'Historias de fantasmas, sucesos inexplicables y terror nocturno.'),
  ('🌶️ Picante', 'picante', 'Contenido subido de tono, historias atrevidas y anécdotas picantes.')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reacciones ENABLE ROW LEVEL SECURITY;

-- 6. CREATE PUBLIC POLICIES FOR ANONYMOUS ACCESS
-- Anyone can read data, anyone can insert data. No edits or deletes are allowed by the public.

-- Categories policies
CREATE POLICY "Permitir lectura publica de categorias" ON categorias
  FOR SELECT USING (true);

-- Publications policies
CREATE POLICY "Permitir lectura publica de publicaciones" ON publicaciones
  FOR SELECT USING (true);

CREATE POLICY "Permitir creacion publica de publicaciones" ON publicaciones
  FOR INSERT WITH CHECK (true);

-- Comments policies
CREATE POLICY "Permitir lectura publica de comentarios" ON comentarios
  FOR SELECT USING (true);

CREATE POLICY "Permitir creacion publica de comentarios" ON comentarios
  FOR INSERT WITH CHECK (true);

-- Reactions policies
CREATE POLICY "Permitir lectura publica de reacciones" ON reacciones
  FOR SELECT USING (true);

CREATE POLICY "Permitir creacion publica de reacciones" ON reacciones
  FOR INSERT WITH CHECK (true);

-- 7. ADMIN TABLE
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin policies
CREATE POLICY "Admin can delete comments" ON comentarios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = auth.email()
    )
  );

-- Insert admin user (cuentatodo@gmail.com)
INSERT INTO admins (email) VALUES ('cuentatodo@gmail.com')
ON CONFLICT (email) DO NOTHING;
