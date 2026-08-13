"use client";
import { useEffect, useState } from "react";
import { useQuiz } from "../QuizProvider";
import { Step, VIDEO } from "../../lib/content";
import VideoPlayer from "../VideoPlayer";

export default function VideoStep({
  step,
}: {
  step: Extract<Step, { kind: "video" }>;
}) {
  const { nextStep } = useQuiz();
  const [revealed, setRevealed] = useState(step.ctaDelay <= 0);

  useEffect(() => {
    if (step.ctaDelay <= 0) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), step.ctaDelay * 1000);
    return () => clearTimeout(t);
  }, [step.ctaDelay]);

  const isFinal = step.variant === "final";

  return (
    <div className="step-enter flex flex-col items-center gap-5 pt-2 pb-8 w-full max-w-md mx-auto">
      {isFinal && (
        <div className="text-center px-2">
          <h2 className="text-xl font-black text-chia-deep">
            {step.finalHeadline}
          </h2>
          <p className="text-gray-600 text-sm mt-2">{step.finalSubtitle}</p>
        </div>
      )}

      {!isFinal && (
        <p className="text-center font-bold text-chia-deep px-2">
          {step.caption}
        </p>
      )}

      <VideoPlayer account={VIDEO.account} player={step.player} />

      {/* Página final: el CTA lo renderiza el propio Vturb dentro del video */}
      {isFinal && (
        <p className="text-center text-sm font-semibold text-gray-500">
          {step.caption}
        </p>
      )}

      {/* Bloque revelado tras el "pitch" del video (delay configurable) */}
      {!isFinal && revealed && (
        <div className="cta-gate w-full animate-fade-in-up">
          <button onClick={nextStep} className="btn-primary w-full cta-pulse">
            {step.ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}
