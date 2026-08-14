"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import VideoPlayer from "../components/VideoPlayer";
import PlanCards from "../components/PlanCards";
import { VIDEO } from "../lib/content";

// Página de PRUEBA para validar el tracking del GTM.
// Réplica de la página final (VSL 2 + planes), pero con el delay del
// CTA en 1 segundo para poder probar sin esperar el pitch completo.
const TEST_CTA_DELAY = 1; // segundos

export default function TestePage() {
  const [revealed, setRevealed] = useState(TEST_CTA_DELAY <= 0);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), TEST_CTA_DELAY * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col items-center gap-5">
        <Image
          src="/logo.png"
          alt="Mounjaro de Chía"
          width={130}
          height={86}
          priority
          className="h-auto w-[120px]"
        />

        <div className="text-center px-2">
          <h2 className="text-xl font-black text-chia-deep">
            ✅ ¡Análisis completado con éxito!
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Ahora mira el video para descubrir cómo usar el Mounjaro de Chía
            para perder peso ya en los próximos 30 días…
          </p>
        </div>

        <VideoPlayer account={VIDEO.account} player={VIDEO.vsl2Player} />

        {!revealed && (
          <p className="text-center text-sm font-semibold text-gray-500">
            🔒 Mira hasta el final para recibir la receta…
          </p>
        )}

        {revealed && (
          <div className="cta-gate w-full animate-fade-in-up">
            <p className="text-center text-lg font-black text-chia-deep mb-4">
              Fórmula personalizada para ti
            </p>
            <PlanCards cta="OBTENER MI PLAN" />
          </div>
        )}
      </div>
    </main>
  );
}
