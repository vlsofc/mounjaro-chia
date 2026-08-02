"use client";
import Image from "next/image";
import { CHECKOUT } from "../lib/content";

interface Plan {
  img: string;
  alt: string;
  href: string;
  premium?: boolean;
}

const PLANS: Plan[] = [
  {
    img: "/plan-completo.png",
    alt: "Mounjaro de Chía — Plan Completo",
    href: CHECKOUT.completo,
  },
  {
    img: "/plan-premium.png",
    alt: "Mounjaro de Chía — Plan Premium Completo",
    href: CHECKOUT.premium,
    premium: true,
  },
];

export default function PlanCards({ cta }: { cta: string }) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {PLANS.map((p) => (
        <div key={p.img} className="flex flex-col gap-3 w-full">
          <a href={p.href} className="block active:scale-[.99] transition-transform">
            <Image
              src={p.img}
              alt={p.alt}
              width={1332}
              height={2000}
              className="w-full h-auto rounded-2xl shadow-lg"
              sizes="(max-width: 448px) 100vw, 448px"
            />
          </a>
          <a href={p.href} className="btn-primary w-full cta-pulse">
            {cta}
          </a>
        </div>
      ))}
    </div>
  );
}
