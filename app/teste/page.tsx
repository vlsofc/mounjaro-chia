"use client";
import Image from "next/image";
import VideoPlayer from "../components/VideoPlayer";
import PlanCards from "../components/PlanCards";
import { VIDEO } from "../lib/content";

// Página de PRUEBA para validar el tracking del GTM.
// Solo muestra la VSL final + las 2 ofertas con botón de checkout.
// Sin quiz, sin delay: los planes aparecen de inmediato.
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

        <VideoPlayer account={VIDEO.account} player={VIDEO.vsl2Player} />

        <PlanCards cta="OBTENER MI PLAN" />
      </div>
    </main>
  );
}
