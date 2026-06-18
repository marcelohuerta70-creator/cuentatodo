import { Categoria, PublicacionConDetalles, Comentario } from '../types';

export const MOCK_CATEGORIAS: Categoria[] = [
  {
    id: 'cat-1',
    nombre: '😂 Chistes',
    slug: 'chistes',
    descripcion: 'Comparte tus mejores chistes y sácale una sonrisa a la comunidad.'
  },
  {
    id: 'cat-2',
    nombre: '🤫 Confesiones',
    slug: 'confesiones',
    descripcion: 'Saca a la luz tus secretos mejor guardados de forma totalmente anónima.'
  },
  {
    id: 'cat-3',
    nombre: '📖 Historias',
    slug: 'historias',
    descripcion: 'Cuéntanos anécdotas, relatos o historias largas que merezcan ser leídas.'
  },
  {
    id: 'cat-4',
    nombre: '👀 Chismes',
    slug: 'chismes',
    descripcion: 'El rincón del drama, rumores e intrigas del momento.'
  },
  {
    id: 'cat-5',
    nombre: '🗣 Descargos',
    slug: 'descargos',
    descripcion: 'Desahógate y suelta toda la frustración sobre el trabajo, estudios o la vida misma.'
  },
  {
    id: 'cat-6',
    nombre: '💡 Factos',
    slug: 'factos',
    descripcion: 'Verdades que duelen, opiniones impopulares o verdades absolutas de la vida.'
  },
  {
    id: 'cat-7',
    nombre: '🚩 Red Flags',
    slug: 'red-flags',
    descripcion: 'Alertas y comportamientos sospechosos que has notado en personas o situaciones.'
  },
  {
    id: 'cat-8',
    nombre: '🟢 Green Flags',
    slug: 'green-flags',
    descripcion: 'Cosas bonitas, sanas y positivas que demuestran que alguien vale la pena.'
  },
  {
    id: 'cat-9',
    nombre: '👻 Paranormal',
    slug: 'paranormal',
    descripcion: 'Historias de fantasmas, sucesos inexplicables y terror nocturno.'
  },
  {
    id: 'cat-10',
    nombre: '🌶️ Picante',
    slug: 'picante',
    descripcion: 'Contenido subido de tono, historias atrevidas y anécdotas picantes.'
  }
];

export const MOCK_PUBLICACIONES: PublicacionConDetalles[] = [
  {
    id: 'post-1',
    categoria_id: 'cat-1',
    titulo: 'El chiste del programador y el café',
    contenido: '¿Por qué los programadores prefieren el café oscuro? Porque así no ven los bugs flotando en la taza. 😂 Badum tss!',
    nombre: 'DevChistoso',
    anonimo: false,
    slug: 'el-chiste-del-programador-y-el-cafe',
    fecha: '2026-06-17T18:30:00Z',
    comentarios_count: 2,
    total_reacciones: 15,
    reacciones_count: { '😂': 12, '👍': 3 }
  },
  {
    id: 'post-2',
    categoria_id: 'cat-2',
    titulo: 'Comí la comida de mi compañero de oficina por 3 meses',
    contenido: 'Confieso que durante 3 meses estuve comiéndome los postres que mi compañero de oficina dejaba en el refrigerador común. Él siempre se quejaba de que "el fantasma de la oficina" se los llevaba. Hoy renunció y me siento un poco culpable, pero estaban deliciosos.',
    nombre: null,
    anonimo: true,
    slug: 'comi-la-comida-de-mi-companero-de-oficina',
    fecha: '2026-06-17T20:15:00Z',
    comentarios_count: 5,
    total_reacciones: 42,
    reacciones_count: { '😮': 15, '🤫': 20, '😂': 7 }
  },
  {
    id: 'post-3',
    categoria_id: 'cat-7',
    titulo: 'Habla de su ex en la primera cita y me pidió pagar su parte y la mía',
    contenido: 'Salí con un chico ayer. Pasó el 80% de la cena hablando de lo "loca" que estaba su ex, y al final de la noche, cuando llegó la cuenta, me dijo que se le había olvidado la billetera y si podía pagar yo todo, que luego me transfería. Obviamente le transferí su mitad pero no le volveré a hablar. ¡Red flag andante!',
    nombre: 'CitaFallida',
    anonimo: false,
    slug: 'habla-de-su-ex-en-la-primera-cita',
    fecha: '2026-06-17T21:00:00Z',
    comentarios_count: 1,
    total_reacciones: 28,
    reacciones_count: { '🚩': 25, '😠': 3 }
  },
  {
    id: 'post-4',
    categoria_id: 'cat-9',
    titulo: 'Escuché susurros en mi habitación vacía',
    contenido: 'Vivo solo en un departamento del piso 12. Anoche, alrededor de las 3:15 AM, me despertó un murmullo muy suave al lado de mi oreja izquierda. Decía claramente "ya es tarde". Encendí las luces de inmediato y no había nadie, las ventanas estaban cerradas y no tengo mascotas. Sigo temblando.',
    nombre: null,
    anonimo: true,
    slug: 'escuche-susurros-en-mi-habitacion-vacia',
    fecha: '2026-06-17T12:00:00Z',
    comentarios_count: 3,
    total_reacciones: 19,
    reacciones_count: { '👻': 15, '😨': 4 }
  }
];

export const MOCK_COMENTARIOS: Record<string, Comentario[]> = {
  'post-1': [
    {
      id: 'com-1',
      publicacion_id: 'post-1',
      nombre: 'WebDev',
      comentario: 'Jajaja muy viejo el chiste pero sigue aplicando.',
      fecha: '2026-06-17T19:00:00Z'
    },
    {
      id: 'com-2',
      publicacion_id: 'post-1',
      nombre: null,
      comentario: 'Yo prefiero el té por la misma razón.',
      fecha: '2026-06-17T19:30:00Z'
    }
  ],
  'post-2': [
    {
      id: 'com-3',
      publicacion_id: 'post-2',
      nombre: 'KarmaIsReal',
      comentario: 'Eso no se hace. Ojalá te caiga una maldición estomacal.',
      fecha: '2026-06-17T20:20:00Z'
    },
    {
      id: 'com-4',
      publicacion_id: 'post-2',
      nombre: null,
      comentario: '¡Jajaja el fantasma de los postres! Eres un villano de oficina.',
      fecha: '2026-06-17T20:35:00Z'
    }
  ]
};

export const MOCK_EMOJIS_ACCENTS: Record<string, { border: string; text: string; bg: string; shadow: string }> = {
  'chistes': {
    border: 'border-yellow-400 hover:border-yellow-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'confesiones': {
    border: 'border-purple-400 hover:border-purple-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'historias': {
    border: 'border-blue-400 hover:border-blue-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'chismes': {
    border: 'border-pink-400 hover:border-pink-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'descargos': {
    border: 'border-red-400 hover:border-red-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'factos': {
    border: 'border-cyan-400 hover:border-cyan-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'red-flags': {
    border: 'border-orange-400 hover:border-orange-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'green-flags': {
    border: 'border-green-400 hover:border-green-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'paranormal': {
    border: 'border-slate-400 hover:border-slate-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  },
  'picante': {
    border: 'border-amber-400 hover:border-amber-500',
    text: 'text-white',
    bg: 'bg-white/70',
    shadow: 'shadow-zinc-200/50'
  }
};
