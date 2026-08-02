"use client";
import { useQuiz } from "../QuizProvider";
import { Step } from "../../lib/content";

export default function NameStep({
  step,
  index,
}: {
  step: Extract<Step, { kind: "name" }>;
  index: number;
}) {
  const { name, setName, setAnswer, nextStep } = useQuiz();

  const handleContinue = () => {
    if (!name.trim()) return;
    setAnswer(index, name.trim());
    nextStep();
  };

  return (
    <div className="step-enter flex flex-col gap-6 pt-6 pb-6">
      <h2 className="text-[22px] leading-tight font-extrabold text-chia-deep text-center px-2">
        {step.question}
      </h2>

      <p className="text-center text-sm text-gray-500 px-3">{step.subtitle}</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder={step.placeholder}
        autoFocus
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-center text-lg font-semibold text-chia-deep outline-none focus:border-chia-light transition"
      />

      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        className="btn-primary w-full"
      >
        {step.buttonLabel}
      </button>
    </div>
  );
}
