export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string
          nombre: string
          slug: string
          descripcion: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          descripcion: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          descripcion?: string
          created_at?: string
        }
        Relationships: []
      }
      publicaciones: {
        Row: {
          id: string
          categoria_id: string
          titulo: string
          contenido: string
          nombre: string | null
          anonimo: boolean
          slug: string
          fecha: string
        }
        Insert: {
          id?: string
          categoria_id: string
          titulo: string
          contenido: string
          nombre?: string | null
          anonimo?: boolean
          slug: string
          fecha?: string
        }
        Update: {
          id?: string
          categoria_id?: string
          titulo?: string
          contenido?: string
          nombre?: string | null
          anonimo?: boolean
          slug?: string
          fecha?: string
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }
      comentarios: {
        Row: {
          id: string
          publicacion_id: string
          nombre: string | null
          comentario: string
          fecha: string
        }
        Insert: {
          id?: string
          publicacion_id: string
          nombre?: string | null
          comentario: string
          fecha?: string
        }
        Update: {
          id?: string
          publicacion_id?: string
          nombre?: string | null
          comentario?: string
          fecha?: string
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_publicacion_id_fkey"
            columns: ["publicacion_id"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          }
        ]
      }
      reacciones: {
        Row: {
          id: string
          publicacion_id: string
          tipo: string
          fecha: string
        }
        Insert: {
          id?: string
          publicacion_id: string
          tipo: string
          fecha?: string
        }
        Update: {
          id?: string
          publicacion_id?: string
          tipo?: string
          fecha?: string
        }
        Relationships: [
          {
            foreignKeyName: "reacciones_publicacion_id_fkey"
            columns: ["publicacion_id"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
