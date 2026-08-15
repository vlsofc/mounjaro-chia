"use client";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { VIDEO } from "../lib/content";

// Página de UPSELL (post-compra) — réplica del funnel del ayuno metabólico.
// Video VTurb + widget de checkout Hotmart revelado tras el pitch.
const UPSELL_PLAYER = "6a804b4a43558ce36c3a0b30";
const WIDGET_DELAY = 305; // 5 min 05 s hasta revelar el widget de Hotmart

export default function UpsellPage() {
  const [showWidget, setShowWidget] = useState(WIDGET_DELAY <= 0);
  const widgetInitialized = useRef(false);

  // Cuenta regresiva para revelar el widget
  useEffect(() => {
    const t = setTimeout(() => setShowWidget(true), WIDGET_DELAY * 1000);
    return () => clearTimeout(t);
  }, []);

  // Carga la librería de checkout de Hotmart
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Monta el widget de Hotmart cuando se vuelve visible
  useEffect(() => {
    if (showWidget && !widgetInitialized.current) {
      widgetInitialized.current = true;
      const checkoutElements = (window as unknown as { checkoutElements?: { init: (t: string) => { mount: (s: string) => void } } }).checkoutElements;
      if (checkoutElements) {
        checkoutElements.init("salesFunnel").mount("#hotmart-upsell-widget");
      }
    }
  }, [showWidget]);

  // Evita que el usuario cierre la página por accidente
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <main style={styles.main}>
      {/* Banner rojo de alerta */}
      <section style={styles.banner}>
        <p style={styles.bannerText}>
          <span style={styles.bannerHighlight}>NO SALGAS DE ESTA PAGINA</span> — ESTAMOS
          <br />
          CREANDO TU ACCESO.
          <br />
          CERRARLA AHORA PODRIA GENERAR ERRORES
          <br />
          EN TU PEDIDO.
        </p>
      </section>

      {/* Título */}
      <section style={styles.titleSection}>
        <h1 style={styles.title}>
          Mira abajo tu
          <br />
          <span style={styles.titleHighlight}>PRIMERA CLASE</span>!
        </h1>
        <p style={styles.emoji}>👇</p>
      </section>

      {/* Video VTurb */}
      <section style={styles.videoSection}>
        <VideoPlayer account={VIDEO.account} player={UPSELL_PLAYER} />
      </section>

      {/* Widget de Hotmart — aparece tras la cuenta regresiva */}
      <section
        style={{
          ...styles.widgetSection,
          opacity: showWidget ? 1 : 0,
          transform: showWidget ? "translateY(0)" : "translateY(32px)",
          pointerEvents: showWidget ? "auto" : "none",
          height: showWidget ? "auto" : 0,
          overflow: showWidget ? "visible" : "hidden",
        }}
      >
        <div id="hotmart-upsell-widget" />
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    backgroundColor: "#FF0000",
    padding: "12px 16px",
    textAlign: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.4,
    maxWidth: "448px",
    margin: "0 auto",
    textTransform: "uppercase",
  },
  bannerHighlight: {
    color: "#fde047",
  },
  titleSection: {
    width: "100%",
    padding: "32px 16px 16px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.2,
    margin: 0,
  },
  titleHighlight: {
    color: "#ef4444",
  },
  emoji: {
    fontSize: "30px",
    marginTop: "4px",
  },
  videoSection: {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "0 16px",
  },
  widgetSection: {
    width: "100%",
    maxWidth: "512px",
    margin: "0 auto",
    padding: "0 16px 64px",
    transition: "all 0.7s ease",
  },
};
