import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import EmojiBackground from "@/components/EmojiBackground";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CuentaTodo - Comparte Historias, Confesiones y Chistes Anónimamente",
  description: "Una plataforma pública y rápida para compartir lo que quieras sin registro. El contenido es el protagonista.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fredoka.variable} h-full antialiased light`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0b0e17] text-white relative" style={{ color: '#f4f6fa' }}>
        {/* Emoji Background Collage */}
        <EmojiBackground />
        
        {/* Content Container (relative z-10 so it sits above the background) */}
        <div className="relative z-10 min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
