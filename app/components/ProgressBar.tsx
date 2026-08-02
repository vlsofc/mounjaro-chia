"use client";
import { useQuiz } from "./QuizProvider";

export default function ProgressBar() {
  const { progress } = useQuiz();
  if (!progress) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-chia-dark">
        <span>
          Etapa {progress.index} de {progress.total}
        </span>
        <span>{progress.percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="progress-fill h-full rounded-full"
          style={{
            width: `${progress.percent}%`,
            background: "linear-gradient(90deg,#99cc33,#4d9900)",
          }}
        />
      </div>
    </div>
  );
}
