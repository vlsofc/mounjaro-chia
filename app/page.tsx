"use client";
import { QuizProvider, useQuiz } from "./components/QuizProvider";
import Logo from "./components/Logo";
import ProgressBar from "./components/ProgressBar";
import BackButton from "./components/BackButton";
import OptionsStep from "./components/steps/OptionsStep";
import SliderStep from "./components/steps/SliderStep";
import NameStep from "./components/steps/NameStep";
import VideoStep from "./components/steps/VideoStep";
import { STEPS } from "./lib/content";

function QuizContent() {
  const { currentStep } = useQuiz();
  const step = STEPS[currentStep];
  const showProgress = "group" in step; // pasos de quiz muestran barra de progreso

  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <div className="w-full max-w-md mx-auto px-4 flex flex-col min-h-screen">
        <Logo />

        {showProgress && (
          <div className="flex items-center gap-2 mb-1">
            <BackButton />
            <div className="flex-1">
              <ProgressBar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {step.kind === "options" && (
            <OptionsStep step={step} index={currentStep} />
          )}
          {step.kind === "slider" && (
            <SliderStep step={step} index={currentStep} />
          )}
          {step.kind === "name" && <NameStep step={step} index={currentStep} />}
          {step.kind === "video" && <VideoStep step={step} />}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}
