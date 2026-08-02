"use client";
import { useState } from "react";
import { useQuiz } from "../QuizProvider";
import { Step } from "../../lib/content";

export default function SliderStep({
  step,
  index,
}: {
  step: Extract<Step, { kind: "slider" }>;
  index: number;
}) {
  const { setAnswer, nextStep } = useQuiz();
  const [unitIdx, setUnitIdx] = useState(0);
  const unit = step.units[unitIdx];
  const [value, setValue] = useState(unit.default);

  const switchUnit = (i: number) => {
    setUnitIdx(i);
    setValue(step.units[i].default);
  };

  const handleContinue = () => {
    setAnswer(index, `${value}${unit.suffix}`);
    nextStep();
  };

  const pct = ((value - unit.min) / (unit.max - unit.min)) * 100;

  return (
    <div className="step-enter flex flex-col gap-6 pt-4 pb-6">
      <h2 className="text-[22px] leading-tight font-extrabold text-chia-deep text-center px-2">
        {step.question}
      </h2>

      {/* Toggle de unidad */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {step.units.map((u, i) => (
            <button
              key={u.id}
              onClick={() => switchUnit(i)}
              className={`px-6 py-1.5 rounded-full text-sm font-bold transition ${
                i === unitIdx ? "bg-chia text-white shadow" : "text-gray-500"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Valor grande */}
      <div className="text-center">
        <span className="text-6xl font-black text-chia-deep">{value}</span>
        <span className="text-2xl font-bold text-chia ml-1">{unit.suffix}</span>
      </div>

      {/* Slider */}
      <div className="px-1">
        <input
          type="range"
          min={unit.min}
          max={unit.max}
          step={unit.step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            background: `linear-gradient(90deg,#4d9900 ${pct}%,#e5e7eb ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{unit.min}</span>
          <span>{unit.max}</span>
        </div>
        <p className="text-center text-xs font-bold tracking-wide text-gray-400 mt-3">
          ARRASTRA PARA AJUSTAR
        </p>
      </div>

      <p className="text-center text-sm text-gray-500 px-3">{step.footnote}</p>

      <button onClick={handleContinue} className="btn-primary w-full mt-1">
        Continuar ➡️
      </button>
    </div>
  );
}
