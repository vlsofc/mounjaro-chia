"use client";
import { useQuiz } from "./QuizProvider";

export default function BackButton() {
  const { prevStep, currentStep } = useQuiz();
  if (currentStep === 0) return null;

  return (
    <button
      onClick={prevStep}
      aria-label="Volver"
      className="w-9 h-9 flex items-center justify-center rounded-full text-chia-dark hover:bg-green-50 active:scale-95 transition"
    >
      <svg width="20" height="20" viewBox="0 0 320 512" fill="currentColor">
        <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256l137.4-137.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
    </button>
  );
}
