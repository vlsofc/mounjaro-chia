"use client";
import Image from "next/image";
import { useQuiz } from "../QuizProvider";
import { Step, Gender } from "../../lib/content";

export default function OptionsStep({
  step,
  index,
}: {
  step: Extract<Step, { kind: "options" }>;
  index: number;
}) {
  const { setAnswer, nextStep, gender, setGender } = useQuiz();

  const handleSelect = (optId: string) => {
    if (step.variant === "gender") {
      setGender(optId as Gender);
    }
    setAnswer(index, optId);
    nextStep();
  };

  return (
    <div className="step-enter flex flex-col gap-5 pt-4 pb-6">
      <div className="text-center">
        <h2 className="text-[22px] leading-tight font-extrabold text-chia-deep px-2">
          {step.question}
        </h2>
        {step.subtitle && (
          <p className="text-gray-500 text-sm mt-3 px-2">{step.subtitle}</p>
        )}
      </div>

      {step.variant === "gender" ? (
        <div className="grid grid-cols-2 gap-4">
          {step.options.map((o) => (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className="rounded-2xl overflow-hidden border-2 border-chia-light bg-white shadow-sm hover:shadow-md active:scale-[.97] transition"
            >
              <div className="aspect-[3/4] relative bg-green-50">
                <Image
                  src={o.img![o.id as Gender] ?? o.img!.female}
                  alt={o.label}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
              <div className="bg-chia py-2.5 font-extrabold text-white text-center">
                {o.label}
              </div>
            </button>
          ))}
        </div>
      ) : step.variant === "image" ? (
        <div className={`grid ${step.columns === 2 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
          {step.options.map((o) => {
            const label =
              gender === "male" && o.labelMale
                ? o.labelMale
                : gender === "female" && o.labelFemale
                ? o.labelFemale
                : o.label;
            const src = o.img![gender];
            const horizontal = step.columns === 1;
            return (
              <button
                key={o.id}
                onClick={() => handleSelect(o.id)}
                className={`rounded-2xl overflow-hidden border-2 border-gray-200 bg-white shadow-sm hover:border-chia-light hover:shadow-md active:scale-[.98] transition ${
                  horizontal ? "flex items-center" : "flex flex-col"
                }`}
              >
                <div
                  className={`relative bg-green-50 ${
                    horizontal ? "w-28 h-28 shrink-0" : "w-full aspect-square"
                  }`}
                >
                  <Image src={src} alt={label} fill className="object-cover" sizes="180px" />
                </div>
                <div className={`flex-1 px-3 py-2 ${horizontal ? "text-left" : "text-center"}`}>
                  <div className="font-extrabold text-chia-deep">{label}</div>
                  {o.sublabel && (
                    <div className="text-xs text-gray-500 mt-0.5">{o.sublabel}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        // variant === "emoji"
        <div className={`grid ${step.columns === 2 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
          {step.options.map((o) => (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className="flex items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm hover:border-chia-light hover:shadow-md active:scale-[.98] transition"
            >
              <span className="text-2xl leading-none">{o.emoji}</span>
              <span className="flex-1">
                <span className="block font-bold text-chia-deep">{o.label}</span>
                {o.sublabel && (
                  <span className="block text-xs text-gray-500 mt-0.5">{o.sublabel}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
