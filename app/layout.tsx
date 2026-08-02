import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Mounjaro de Chía - Protocolo del Mounjaro de Chía",
  description: "Descubre tu protocolo personalizado del Mounjaro de Chía.",
};

// TODO: reemplaza con tu propio ID de Facebook Pixel antes de publicar.
const FB_PIXEL_ID = "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Rastreo de UTMs (mismo tracker genérico del funnel original) */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids=""
          strategy="afterInteractive"
        />

        {/* Reproductor de video VTurb / ConverteAI (VSL) */}
        <Script
          src="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
          strategy="afterInteractive"
        />

        {/* Facebook Pixel — agrega tu propio ID en FB_PIXEL_ID */}
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className={`${nunito.className} antialiased`}>{children}</body>
    </html>
  );
}
