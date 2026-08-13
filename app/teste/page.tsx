"use client";
import Image from "next/image";
import VideoPlayer from "../components/VideoPlayer";
import { VIDEO } from "../lib/content";

// Página de PRUEBA para validar el tracking del GTM.
// Igual que la página final: solo la VSL — el CTA lo renderiza el propio
// Vturb dentro del video (sin imágenes ni botones de planes).
export default function TestePage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col items-center gap-6">
        <Image
          src="/logo.png"
          alt="Gelatina de Chía"
          width={160}
          height={70}
          priority
          className="h-auto w-[160px]"
        />

        <div className="text-center px-2">
          <h2 className="text-xl font-black text-chia-deep">
            ✅ ¡Análisis completado con éxito!
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Ahora mira el video para descubrir cómo usar la Gelatina de Chía
            para perder peso ya en los próximos 30 días…
          </p>
        </div>

        <VideoPlayer account={VIDEO.account} player={VIDEO.vsl2Player} />

        <p className="text-center text-sm font-semibold text-gray-500">
          🔒 Mira hasta el final para recibir la receta…
        </p>
      </div>
    </main>
  );
}
