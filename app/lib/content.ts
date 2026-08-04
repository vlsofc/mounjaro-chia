// =============================================================================
//  Mounjaro de Chía — contenido del funnel (traducido al español)
//  Estructura fiel al funnel de referencia:
//    Quiz 1 (5 pasos) -> VSL 1 (video con CTA oculto)
//    -> Quiz 2 (11 pasos) -> Página final (VSL 2 + 2 planes)
// =============================================================================

export type Gender = "male" | "female";

// -----------------------------------------------------------------------------
//  Imágenes (servidas localmente desde /public/images)
// -----------------------------------------------------------------------------
export const IMAGES = {
  body: {
    regular: { male: "/images/body-regular-BrqfJkDu.webp", female: "/images/Regular.webp" },
    flacido: { male: "/images/body-flacido-oYhmUAOd.webp", female: "/images/Flacida.webp" },
    sobrepeso: { male: "/images/body-sobrepeso-gutbcNBO.webp", female: "/images/Sobrepeso.webp" },
  },
  fat: {
    abdomen: { male: "/images/fat-abdomen-new-D6Nw6t9-.webp", female: "/images/fat-abdomen-f-B_P0vzNQ.webp" },
    pecho: { male: "/images/fat-peito-new-Bx9HWLZ4.webp", female: "/images/fat-peito-f-qCzQMqPh.webp" },
    flancos: { male: "/images/fat-flancos-N1J9ZlBr.webp", female: "/images/fat-flancos-f-8N-KcZ_L.webp" },
    brazos: { male: "/images/fat-bracos-new-uh4AGWlu.webp", female: "/images/fat-bracos-f-DWmVKJkl.webp" },
  },
};

// -----------------------------------------------------------------------------
//  Reproductores de video (VTurb / ConverteAI)
//  TODO: sustituye estos IDs por los de tu propia VSL en español.
// -----------------------------------------------------------------------------
export const VIDEO = {
  account: "a977b5e6-a7d9-43df-9bd2-c815069210f9",
  vsl1Player: "6a6d87cb1c982c86efa0dfbf",
  vsl2Player: "6a6ec2c2b6e0b7d03f6871b8",
};

// Segundos hasta liberar el botón (CTA) oculto sobre cada video.
// 0 = el botón queda liberado de inmediato (sin espera).
// Para volver a ocultarlo hasta el "pitch" del video, pon aquí los segundos.
export const CTA_DELAY = {
  vsl1: 905, // 15 min 05 s
  vsl2: 590, // 9 min 50 s
};

// -----------------------------------------------------------------------------
//  Enlaces de checkout
//  ⚠️ IMPORTANTE: reemplaza estos por TUS propios enlaces de pago.
//  (No se copian los del sitio de referencia para no enviarle tus ventas.)
// -----------------------------------------------------------------------------
export const CHECKOUT = {
  completo: "https://pay.hotmart.com/M105524681I?off=3zy067je", // Plan Completo - $9,90
  premium: "https://pay.hotmart.com/M105524681I?off=yp0fcsmn",  // Plan Premium - $19,90
};

// -----------------------------------------------------------------------------
//  Tipos de pasos
// -----------------------------------------------------------------------------
export interface OptionItem {
  id: string;
  label: string;
  labelMale?: string;   // variación de género (ej. "Flácido")
  labelFemale?: string; // variación de género (ej. "Flácida")
  sublabel?: string;
  emoji?: string;
  img?: { male: string; female: string };
}

export type Step =
  | {
      kind: "options";
      group: "q1" | "q2";
      variant: "emoji" | "image" | "gender";
      question: string;
      subtitle?: string;
      columns: 1 | 2;
      options: OptionItem[];
    }
  | {
      kind: "slider";
      group: "q2";
      question: string;
      footnote: string;
      units: {
        id: string;
        label: string;
        min: number;
        max: number;
        default: number;
        step: number;
        suffix: string;
      }[];
    }
  | {
      kind: "name";
      group: "q2";
      question: string;
      subtitle: string;
      placeholder: string;
      buttonLabel: string;
    }
  | {
      kind: "video";
      variant: "vsl1" | "final";
      caption: string;
      player: string;
      ctaLabel: string;
      ctaDelay: number;
      // solo para la página final:
      finalHeadline?: string;
      finalSubtitle?: string;
      finalFormulaLabel?: string; // "Fórmula personalizada para {name}"
    };

// -----------------------------------------------------------------------------
//  FLUJO COMPLETO
// -----------------------------------------------------------------------------
export const STEPS: Step[] = [
  // ===== QUIZ 1 (5 pasos) =====
  {
    kind: "options",
    group: "q1",
    variant: "emoji",
    columns: 1,
    question: "¿Cuántos kilos quieres perder con el Mounjaro de Chía?",
    options: [
      { id: "ate5", emoji: "🎯", label: "Hasta 5 kg" },
      { id: "6a10", emoji: "💪", label: "6 a 10 kg" },
      { id: "11a15", emoji: "🔥", label: "11 a 15 kg" },
      { id: "16a20", emoji: "⚡", label: "16 a 20 kg" },
      { id: "mais20", emoji: "🚀", label: "Más de 20 kg" },
    ],
  },
  {
    kind: "options",
    group: "q1",
    variant: "gender",
    columns: 2,
    question: "¿Cuál es tu género?",
    subtitle:
      "Esta información nos ayuda a ajustar tu protocolo del Mounjaro de Chía según tu metabolismo.",
    options: [
      { id: "male", label: "Hombre", img: { male: IMAGES.body.regular.male, female: IMAGES.body.regular.male } },
      { id: "female", label: "Mujer", img: { male: IMAGES.body.regular.female, female: IMAGES.body.regular.female } },
    ],
  },
  {
    kind: "options",
    group: "q1",
    variant: "emoji",
    columns: 1,
    question: "¿Cuál es tu edad?",
    options: [
      { id: "menos25", emoji: "👧", label: "Menos de 25" },
      { id: "25a34", emoji: "👩", label: "25 a 34" },
      { id: "35a44", emoji: "👩‍💼", label: "35 a 44" },
      { id: "45a54", emoji: "🧕", label: "45 a 54" },
      { id: "55mais", emoji: "👵", label: "55+" },
    ],
  },
  {
    kind: "options",
    group: "q1",
    variant: "image",
    columns: 1,
    question: "¿Cómo clasificarías tu cuerpo hoy?",
    options: [
      { id: "regular", label: "Regular", sublabel: "Peso normal", img: IMAGES.body.regular },
      { id: "flacido", labelMale: "Flácido", labelFemale: "Flácida", label: "Flácida", sublabel: "Poca firmeza", img: IMAGES.body.flacido },
      { id: "sobrepeso", label: "Sobrepeso", sublabel: "Grasa visible", img: IMAGES.body.sobrepeso },
    ],
  },
  {
    kind: "options",
    group: "q1",
    variant: "image",
    columns: 2,
    question: "¿En qué zona de tu cuerpo te gustaría reducir más grasa?",
    options: [
      { id: "abdomen", label: "Abdomen", img: IMAGES.fat.abdomen },
      { id: "pecho", label: "Pecho", img: IMAGES.fat.pecho },
      { id: "flancos", label: "Flancos", img: IMAGES.fat.flancos },
      { id: "brazos", label: "Brazos", img: IMAGES.fat.brazos },
    ],
  },

  // ===== VSL 1 =====
  {
    kind: "video",
    variant: "vsl1",
    caption: "Mira hasta el final para recibir la receta…",
    player: VIDEO.vsl1Player,
    ctaLabel: "PERSONALIZAR MI RECETA",
    ctaDelay: CTA_DELAY.vsl1,
  },

  // ===== QUIZ 2 (11 pasos) =====
  {
    kind: "slider",
    group: "q2",
    question: "¿Cuál es tu peso actual?",
    footnote: "¡En base a esto, ajustaremos la dosis ideal para los mejores resultados!",
    units: [
      { id: "kg", label: "kg", min: 40, max: 250, default: 70, step: 1, suffix: "kg" },
      { id: "lb", label: "lb", min: 88, max: 550, default: 154, step: 1, suffix: "lb" },
    ],
  },
  {
    kind: "slider",
    group: "q2",
    question: "¿Cuál es tu altura?",
    footnote: "Usaremos tu altura para calcular tu IMC y personalizar el protocolo.",
    units: [
      { id: "cm", label: "cm", min: 140, max: 220, default: 180, step: 1, suffix: "cm" },
      { id: "pulg", label: "pulg", min: 55, max: 87, default: 71, step: 1, suffix: "pulg" },
    ],
  },
  {
    kind: "slider",
    group: "q2",
    question: "¿Cuál es tu objetivo de peso?",
    footnote: "¡En base a esto, ajustaremos la dosis ideal para los mejores resultados!",
    units: [
      { id: "kg", label: "kg", min: 40, max: 250, default: 70, step: 1, suffix: "kg" },
      { id: "lb", label: "lb", min: 88, max: 550, default: 154, step: 1, suffix: "lb" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Cómo impacta tu peso en tu vida hoy?",
    options: [
      { id: "fotos", emoji: "📷", label: "Evito tomarme fotos por vergüenza" },
      { id: "pareja", emoji: "💔", label: "Mi pareja ya no me mira con deseo" },
      { id: "confianza", emoji: "😞", label: "Me siento menos seguro(a)" },
      { id: "social", emoji: "🚫", label: "Evito citas o situaciones sociales" },
      { id: "energia", emoji: "⚡", label: "Afecta mi energía y disposición" },
      { id: "ninguna", emoji: "✋", label: "Ninguna de estas" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Estás realmente satisfecho(a) con tu apariencia?",
    options: [
      { id: "no", emoji: "😔", label: "No, me siento con sobrepeso" },
      { id: "maisoumenos", emoji: "🤔", label: "Más o menos, sé que puedo mejorar" },
      { id: "cambiar", emoji: "💪", label: "No, quiero cambiar mi cuerpo y mi confianza" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Qué es lo que más te impide adelgazar hoy?",
    options: [
      { id: "tiempo", emoji: "⏰", label: "Falta de tiempo / rutina agitada" },
      { id: "autocontrol", emoji: "🍕", label: "Falta de autocontrol" },
      { id: "tudo", emoji: "😤", label: "Ya lo intenté todo y nada funciona" },
      { id: "cara", emoji: "💰", label: "Alimentación cara o difícil" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Cuántos litros de agua sueles beber al día?",
    options: [
      { id: "cafe", emoji: "☕", label: "Solo bebo café / poca agua" },
      { id: "2l", emoji: "💧", label: "Hasta 2 litros" },
      { id: "2a3l", emoji: "💦", label: "Entre 2 y 3 litros" },
      { id: "mais3l", emoji: "🌊", label: "Más de 3 litros" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Cuántas horas duermes por noche?",
    options: [
      { id: "menos5", emoji: "😫", label: "Menos de 5 horas" },
      { id: "5a7", emoji: "😴", label: "Entre 5 y 7 horas" },
      { id: "7a9", emoji: "😊", label: "Entre 7 y 9 horas" },
      { id: "mais9", emoji: "😌", label: "Más de 9 horas" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Cómo es tu rutina hoy?",
    options: [
      { id: "fora", emoji: "🏃", label: "Trabajo fuera y tengo una rutina agitada" },
      { id: "sentado", emoji: "🪑", label: "Trabajo sentado(a) la mayor parte del día" },
      { id: "estresse", emoji: "😰", label: "Mi rutina es estresante e irregular" },
      { id: "mudou", emoji: "🔄", label: "Mi rutina cambió mucho en los últimos años" },
    ],
  },
  {
    kind: "options",
    group: "q2",
    variant: "emoji",
    columns: 1,
    question: "¿Cuál es el cuerpo que quieres alcanzar?",
    options: [
      { id: "emforma", emoji: "💪", label: "En forma", sublabel: "Cuerpo atlético y saludable" },
      { id: "tonificado", emoji: "🏋️", label: "Tonificado", sublabel: "Cuerpo firme con definición" },
    ],
  },
  {
    kind: "name",
    group: "q2",
    question: "¿Cuál es tu nombre?",
    subtitle:
      "Usaremos tu nombre para armar tu protocolo personalizado del Mounjaro de Chía. 🧪",
    placeholder: "Escribe tu nombre",
    buttonLabel: "Continuar ➡️",
  },

  // ===== PÁGINA FINAL (VSL 2 + planes) =====
  {
    kind: "video",
    variant: "final",
    player: VIDEO.vsl2Player,
    ctaLabel: "OBTENER MI PLAN",
    ctaDelay: CTA_DELAY.vsl2,
    finalHeadline: "✅ ¡Análisis completado con éxito!",
    finalSubtitle:
      "Ahora mira el video para descubrir cómo usar el Mounjaro de Chía para perder peso ya en los próximos 30 días…",
    caption: "🔒 Mira hasta el final para recibir la receta…",
    finalFormulaLabel: "Fórmula personalizada para",
  },
];

// Índice del paso VSL1 y del paso final (para lógica de progreso/encabezado)
export const VSL1_INDEX = STEPS.findIndex((s) => s.kind === "video" && s.variant === "vsl1");
export const FINAL_INDEX = STEPS.findIndex((s) => s.kind === "video" && s.variant === "final");

// -----------------------------------------------------------------------------
//  Metadatos de pasos (para tracking y dashboard)
// -----------------------------------------------------------------------------
export type StepPhase = "quiz1" | "vsl1" | "quiz2" | "sales";

// step_type usado en el tracking (mismo criterio que ayuno-metabolico).
export function stepType(i: number): string {
  const s = STEPS[i];
  if (!s) return "unknown";
  if (s.kind === "options")
    return s.variant === "gender"
      ? "gender"
      : s.variant === "image"
      ? "image-options"
      : "options";
  if (s.kind === "slider") return "slider";
  if (s.kind === "name") return "name";
  if (s.kind === "video") return s.variant === "final" ? "sales-page" : "video";
  return "unknown";
}

// Etiqueta legible + fase de cada paso (para el dashboard).
export const STEP_META: { label: string; phase: StepPhase }[] = [
  { label: "Kilos a perder", phase: "quiz1" },
  { label: "Género", phase: "quiz1" },
  { label: "Edad", phase: "quiz1" },
  { label: "Cuerpo actual", phase: "quiz1" },
  { label: "Zona a reducir", phase: "quiz1" },
  { label: "VSL 1 (video)", phase: "vsl1" },
  { label: "Peso actual", phase: "quiz2" },
  { label: "Altura", phase: "quiz2" },
  { label: "Objetivo de peso", phase: "quiz2" },
  { label: "Impacto del peso", phase: "quiz2" },
  { label: "Satisfacción", phase: "quiz2" },
  { label: "Qué te impide adelgazar", phase: "quiz2" },
  { label: "Agua por día", phase: "quiz2" },
  { label: "Horas de sueño", phase: "quiz2" },
  { label: "Rutina", phase: "quiz2" },
  { label: "Cuerpo deseado", phase: "quiz2" },
  { label: "Nombre", phase: "quiz2" },
  { label: "Página de ventas (VSL 2)", phase: "sales" },
];

export const PHASE_LABELS: Record<StepPhase, string> = {
  quiz1: "Quiz 1",
  vsl1: "VSL 1",
  quiz2: "Quiz 2",
  sales: "Ventas",
};

export const PHASE_COLORS: Record<StepPhase, string> = {
  quiz1: "#4d9900",
  vsl1: "#eab308",
  quiz2: "#0ea5e9",
  sales: "#16a34a",
};
