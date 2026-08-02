"use client";
import { CHECKOUT } from "../lib/content";

interface Feature {
  icon: string;
  title: string;
  desc: string;
  bonus?: boolean;
}

const BASE_FEATURES: Feature[] = [
  {
    icon: "📗",
    title: "Receta Completa del Mounjaro de Chía",
    desc: "El paso a paso completo para preparar tu Mounjaro de Chía en casa.",
  },
  {
    icon: "📋",
    title: "Protocolo de 30 Días",
    desc: "Plan diario completo para potenciar tus resultados durante 30 días.",
  },
  {
    icon: "📚",
    title: "Guía de Alimentos Permitidos",
    desc: "Lista completa de lo que puedes y debes comer para acelerar tus resultados.",
  },
  {
    icon: "▶️",
    title: "Clases en Video Exclusivas",
    desc: "Clases prácticas y directas para guiarte en cada etapa del proceso.",
  },
  {
    icon: "💬",
    title: "Soporte por WhatsApp",
    desc: "Resuelve tus dudas directamente con nuestro equipo especializado.",
  },
];

const PREMIUM_FEATURES: Feature[] = [
  ...BASE_FEATURES,
  {
    icon: "🗓️",
    title: "Protocolo de 90 Días (Avanzado)",
    desc: "Plan completo para quienes quieren resultados aún más rápidos y duraderos.",
    bonus: true,
  },
  {
    icon: "📈",
    title: "Acompañamiento Personalizado",
    desc: "Análisis de tu progreso y orientaciones personalizadas durante todo el proceso.",
  },
];

function FeatureRow({ f }: { f: Feature }) {
  return (
    <div className={`flex gap-3 py-3 ${f.bonus ? "bg-amber-50 -mx-3 px-3 rounded-xl" : ""}`}>
      <div className="w-11 h-11 shrink-0 rounded-lg bg-gradient-to-b from-chia-light to-chia flex items-center justify-center text-xl">
        {f.icon}
      </div>
      <div>
        {f.bonus && (
          <span className="inline-block text-[10px] font-black tracking-wide text-amber-600 mb-0.5">
            BONO EXCLUSIVO
          </span>
        )}
        <h4 className="font-extrabold text-chia-deep leading-tight">{f.title}</h4>
        <p className="text-sm text-gray-600 leading-snug">{f.desc}</p>
      </div>
    </div>
  );
}

function PlanCard({
  premium,
  badge,
  badgeEmoji,
  planLabel,
  price,
  pill,
  features,
  href,
  cta,
}: {
  premium?: boolean;
  badge: string;
  badgeEmoji: string;
  planLabel: string;
  price: string;
  pill: string;
  features: Feature[];
  href: string;
  cta: string;
}) {
  return (
    <div
      className={`rounded-3xl bg-[#fbfdf5] border-2 ${
        premium ? "border-amber-300" : "border-green-200"
      } shadow-lg overflow-hidden`}
    >
      <div className="p-5 pt-4">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-black tracking-wide text-chia-deep">
            <span>{badgeEmoji}</span>
            {badge}
          </span>
        </div>

        {/* Título de marca */}
        <div className="text-center mt-3">
          <div className="text-3xl font-black tracking-tight text-chia-deep leading-none">
            MOUNJARO
          </div>
          <div className="text-2xl font-bold italic text-chia leading-none -mt-0.5">
            de Chía 🌿
          </div>
          <div
            className={`mt-2 text-sm font-black tracking-[0.2em] ${
              premium ? "text-amber-600" : "text-chia-dark"
            }`}
          >
            {planLabel}
          </div>
        </div>

        {/* Precio */}
        <p className="text-center text-gray-600 mt-3 font-semibold">
          Acceso completo por solo
        </p>
        <div className="text-center">
          <span className="text-6xl font-black text-chia">{price}</span>
        </div>

        {/* Pill */}
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-green-200 px-4 py-1.5 text-sm font-bold text-chia-dark text-center">
            🛡️ {pill}
          </span>
        </div>

        {/* Features */}
        <div className="mt-4 divide-y divide-gray-100">
          {features.map((f) => (
            <FeatureRow key={f.title} f={f} />
          ))}
        </div>

        {/* Garantía */}
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 flex gap-3 items-start">
          <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-b from-chia-light to-chia-dark flex items-center justify-center text-white font-black text-sm">
            30
          </div>
          <div>
            <h4 className="font-black text-chia-deep text-sm">
              GARANTÍA INCONDICIONAL DE 30 DÍAS
            </h4>
            <p className="text-sm text-gray-600 leading-snug">
              ¿No te gustó? Te devolvemos todo tu dinero. Sin preguntas, sin
              burocracia.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <a href={href} className="btn-primary w-full cta-pulse">
          {cta}
        </a>
      </div>
    </div>
  );
}

export default function PlanCards({ cta }: { cta: string }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PlanCard
        badge="OFERTA EXCLUSIVA"
        badgeEmoji="🔒"
        planLabel="PLAN COMPLETO"
        price="R$ 47"
        pill="Pago único • Acceso inmediato"
        features={BASE_FEATURES}
        href={CHECKOUT.completo}
        cta={cta}
      />
      <PlanCard
        premium
        badge="OFERTA PREMIUM"
        badgeEmoji="👑"
        planLabel="PLAN PREMIUM COMPLETO"
        price="R$ 97"
        pill="Pago único • Acceso inmediato"
        features={PREMIUM_FEATURES}
        href={CHECKOUT.premium}
        cta={cta}
      />
    </div>
  );
}
