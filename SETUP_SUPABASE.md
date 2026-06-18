# 🚀 Configurar Supabase en CuentaTodo

## Paso 1: Crear proyecto en Supabase

1. Ve a https://supabase.com
2. Inicia sesión o crea una cuenta
3. Click en "New Project"
4. Llena los datos:
   - **Name:** cuentatodo (o el que prefieras)
   - **Database Password:** Guarda una contraseña segura
   - **Region:** Elige la más cercana a tu ubicación (ej: South America - São Paulo)
5. Click en "Create new project" y espera 1-2 minutos

---

## Paso 2: Obtener las credenciales

1. Una vez creado el proyecto, ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL** → Esto es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Esto es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Paso 3: Actualizar .env.local

En la raíz del proyecto, abre `.env.local` y reemplaza:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Con tus valores reales.

**Ejemplo:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Paso 4: Crear las tablas

1. Ve a tu proyecto en Supabase
2. Click en **SQL Editor** (lado izquierdo)
3. Click en "New Query"
4. Copia TODO el contenido de `/supabase/schema.sql`
5. Pégalo en el editor SQL
6. Click en "Run" (esquina superior derecha)
7. Espera a que se ejecute (verás un ✓ verde)

---

## Paso 5: Verificar que funciona

1. En Supabase, ve a **Table Editor**
2. Verifica que existan estas tablas:
   - ✅ categorias (debe tener 10 categorías)
   - ✅ publicaciones (vacía al inicio)
   - ✅ comentarios (vacía al inicio)
   - ✅ reacciones (vacía al inicio)

---

## Paso 6: Reiniciar servidor de desarrollo

En tu terminal:
```bash
pkill -f "next dev"
npm run dev
```

---

## ✅ ¡Listo!

La app ahora está conectada a Supabase. Cuando publiques contenido, se guardará en la BD real.

---

## 🔍 Troubleshooting

**Error: "Supabase URL and Key must be provided"**
- Asegúrate de que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén en `.env.local`
- Reinicia el servidor

**Error: "row-level security (RLS) policy"**
- Esto significa que las políticas de RLS no están habilitadas
- Vuelve a ejecutar el schema.sql

**Las categorías no aparecen**
- Verifica en Supabase → Table Editor → categorias
- Debe haber 10 filas

---

## 📌 Variables de entorno

| Variable | Donde obtenerla |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |

**Nota:** Las variables con `NEXT_PUBLIC_` son públicas (se envían al navegador). Nunca incluyas la secret key.
