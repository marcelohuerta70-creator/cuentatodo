/**
 * Domain and Database entities for CuentaTodo
 */

export interface Categoria {
  id: string; // UUID
  nombre: string;
  slug: string;
  descripcion: string;
  created_at?: string;
}

export interface Publicacion {
  id: string; // UUID
  categoria_id: string; // UUID
  titulo: string;
  contenido: string;
  nombre: string | null; // Nombre opcional
  anonimo: boolean;
  slug: string;
  fecha: string; // ISO Timestamp
}

export interface Comentario {
  id: string; // UUID
  publicacion_id: string; // UUID
  nombre: string | null; // Nombre opcional
  comentario: string;
  fecha: string; // ISO Timestamp
}

export interface Reaccion {
  id: string; // UUID
  publicacion_id: string; // UUID
  tipo: string; // 'like', 'love', 'funny', 'wow', etc.
  fecha: string; // ISO Timestamp
}

// Custom domain types for combined views
export interface PublicacionConDetalles extends Publicacion {
  categoria?: Categoria;
  comentarios_count: number;
  reacciones_count: Record<string, number>;
  total_reacciones: number;
}
