"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { STEPS, Gender, stepType } from "../lib/content";
import {
  initSession,
  bumpProgress,
  logStepEvent,
  trackCtaClick,
} from "../lib/tracking";

interface QuizContextType {
  currentStep: number;
  answers: Record<number, string>;
  setAnswer: (step: number, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  gender: Gender;
  setGender: (g: Gender) => void;
  name: string;
  setName: (n: string) => void;
  progress: { index: number; total: number; percent: number } | null;
  trackCta: (label?: string) => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

// Posición de cada paso dentro de su grupo de quiz ("Etapa X de N")
const GROUP_TOTALS: Record<string, number> = {
  q1: STEPS.filter((s) => "group" in s && s.group === "q1").length,
  q2: STEPS.filter((s) => "group" in s && s.group === "q2").length,
};

function computeProgress(stepIndex: number) {
  const step = STEPS[stepIndex];
  if (!("group" in step)) return null;
  const group = step.group;
  // índice (1-based) dentro del grupo
  let idx = 0;
  for (let i = 0; i <= stepIndex; i++) {
    const s = STEPS[i];
    if ("group" in s && s.group === group) idx++;
  }
  const total = GROUP_TOTALS[group];
  return { index: idx, total, percent: Math.round((idx / total) * 100) };
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [gender, setGender] = useState<Gender>("female");
  const [name, setName] = useState("");

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    scrollTop();
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollTop();
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, STEPS.length - 1)));
    scrollTop();
  }, []);

  const setAnswer = useCallback((step: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [step]: value }));
  }, []);

  const progress = useMemo(() => computeProgress(currentStep), [currentStep]);

  // ── Tracking (Supabase) ──────────────────────────────────────────────────
  // Al llegar a un paso subimos max_step (retención exacta). Al salir de un
  // paso registramos su evento con el tiempo que el usuario estuvo en él.
  const initedRef = useRef(false);
  const enteredAtRef = useRef(0);
  const prevStepRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const arrived = currentStep;

    if (!initedRef.current) {
      initedRef.current = true;
      initSession().then(() => bumpProgress(arrived, stepType(arrived)));
      prevStepRef.current = arrived;
      enteredAtRef.current = now;
      return;
    }

    const left = prevStepRef.current;
    // solo registramos el evento del paso que se dejó al AVANZAR (no al volver).
    if (arrived > left) {
      logStepEvent(left, stepType(left), now - enteredAtRef.current);
    }
    bumpProgress(arrived, stepType(arrived));
    prevStepRef.current = arrived;
    enteredAtRef.current = now;
  }, [currentStep]);

  const trackCta = useCallback((label = "checkout") => {
    trackCtaClick(label);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        currentStep,
        answers,
        setAnswer,
        nextStep,
        prevStep,
        goToStep,
        gender,
        setGender,
        name,
        setName,
        progress,
        trackCta,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
