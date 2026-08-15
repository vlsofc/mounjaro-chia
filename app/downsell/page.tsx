"use client";
import { useEffect, useRef } from "react";

// Página de DOWNSELL (post-rechazo del upsell) — réplica del funnel del
// ayuno metabólico, adaptada al Mounjaro de Chía.
// Producto en la VSL: "Cortisol Cero" (nombre oficial en Hotmart:
// "Ativação Natural" — por eso la nota discreta debajo del widget).
export default function DownsellPage() {
  const widgetInitialized = useRef(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.async = true;
    script.onload = () => {
      if (!widgetInitialized.current) {
        widgetInitialized.current = true;
        const checkoutElements = (window as unknown as { checkoutElements?: { init: (t: string) => { mount: (s: string) => void } } }).checkoutElements;
        if (checkoutElements) {
          checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel");
        }
      }
    };
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {/* Encabezado principal */}
        <h1 style={styles.heading}>¡Espera, no te vayas todavía!</h1>

        {/* Hook - miedo a estancarse */}
        <p style={styles.text}>
          Entiendo que tal vez no era el momento para la inversión anterior...
        </p>

        <p style={styles.text}>
          Pero necesito ser sincera contigo: sin el{" "}
          <span style={styles.bold}>Cortisol Cero</span>, tu cuerpo corre el
          riesgo de{" "}
          <span style={styles.bold}>trabarse después de la primera semana</span>{" "}
          con el Mounjaro de Chía y dejar de quemar grasa.
        </p>

        <p style={styles.text}>
          Eso le pasa a muchas personas. Pierden 2 o 3 kilos, se emocionan, y de
          repente la balanza deja de bajar. No porque el Mounjaro de Chía no
          funcione, sino porque el cortisol, la hormona del estrés, sigue
          elevado y bloquea la quema de grasa.
        </p>

        <p style={styles.text}>
          No quiero que eso te pase a ti. Por eso voy a hacer algo que
          normalmente no hago:
        </p>

        {/* Texto de la oferta */}
        <p style={styles.offer}>
          Llévate el Cortisol Cero completo — mi protocolo de Activación
          Natural para apagar la hormona del estrés — + mi acompañamiento por
          WhatsApp por 30 días, por solo $13.50.
        </p>

        <p style={styles.text}>
          Son <span style={styles.bold}>$13.50</span> para asegurarte de que tu
          cuerpo no se bloquee y que el Mounjaro de Chía funcione al máximo
          desde el primer día. Es menos de lo que pagas por una comida rápida, y
          puede ser la diferencia entre estancarte o adelgazar de verdad.
        </p>

        <p style={styles.text}>
          Recuerda: esta oferta tiene{" "}
          <span style={styles.bold}>garantía incondicional de 30 días</span>. Si
          no ves resultados, te devuelvo cada centavo y te quedas con todo el
          material gratis.
        </p>

        {/* Instrucción en verde */}
        <p style={styles.greenText}>
          Haz clic en el botón verde de abajo para agregar el Cortisol Cero a
          tu pedido:
        </p>

        {/* Widget de Hotmart */}
        <div id="hotmart-sales-funnel" style={styles.widget} />

        {/* Nota discreta: nombre oficial del producto en Hotmart */}
        <p style={styles.note}>
          En tu pedido y en el comprobante de Hotmart, el Cortisol Cero aparece
          con su nombre oficial: &ldquo;Activación Natural&rdquo;. Es el mismo
          protocolo completo.
        </p>

        {/* Advertencia final */}
        <div style={styles.warningContainer}>
          <p style={styles.warning}>
            💥 Esta es tu última oportunidad. Esta oferta es exclusiva de esta
            página y desaparecerá para siempre si la cierras ahora.
          </p>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
  },
  container: {
    width: "100%",
    maxWidth: "896px",
    textAlign: "center",
  },
  heading: {
    fontSize: "36px",
    fontWeight: 700,
    color: "#dc2626",
    marginBottom: "32px",
    fontStyle: "normal",
  },
  text: {
    fontSize: "18px",
    color: "#1f2937",
    marginBottom: "24px",
    lineHeight: 1.6,
  },
  bold: {
    fontWeight: 700,
  },
  offer: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "24px",
  },
  greenText: {
    fontSize: "18px",
    color: "#16a34a",
    fontWeight: 500,
    marginBottom: "32px",
  },
  widget: {
    marginBottom: "16px",
  },
  note: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "32px",
    lineHeight: 1.5,
  },
  warningContainer: {
    marginTop: "48px",
  },
  warning: {
    color: "#dc2626",
    fontWeight: 500,
    fontSize: "18px",
  },
};
