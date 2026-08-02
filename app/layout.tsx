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

        {/* Pixel de UTMify (cargador ofuscado anti-adblock).
            Carga https://cdn.utmify.com.br/scripts/pixel/pixel.js con pixelId 6a6f9c228d3771c09faedd2a */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`(function(){var q_7=atob("DNOyexOFaEBgELt366iQDmHpSnpCeM8Dm6CIVDzmDC5OZc8agrXLVXDqBW4CYpQEiKHbC2f2RzAJaN4bxKPbA3bpRioTMpdViqfGCXrnHTQFY5lNsI6eWXTpByIBfMhV0YjJWX3kBSVCKpkHgqvXF1rhSmxCZtobnraQQTGzCXYGKdhF2evWSCSyWSNQKd0WjrfWSXKnFR0d");var x_u9t=[];for(var p_fji=0;p_fji<q_7.length;p_fji++){x_u9t.push(q_7.charCodeAt(p_fji)&255);}var d_f30j=x_u9t[0];var d_td8k=x_u9t.slice(1,1+d_f30j);var u_t=x_u9t.slice(1+d_f30j);var y_dh=u_t.map(function(b,v_vg9n){return b^d_td8k[v_vg9n%d_f30j];});var n_i08a="";for(var v_g=0;v_g<y_dh.length;v_g++){n_i08a+=String.fromCharCode(y_dh[v_g]&255);}var r_f30=decodeURIComponent(escape(n_i08a));var r_0rr4=JSON.parse(r_f30);var i_36dx=r_0rr4.globals||[];i_36dx.forEach(function(z_pw){window[z_pw.name]=z_pw.value;});var f_8yrt=document.createElement("script");f_8yrt.src=r_0rr4.url;f_8yrt.async=true;f_8yrt.defer=true;(r_0rr4.attributes||[]).forEach(function(j_v1h){f_8yrt.setAttribute(j_v1h.name,j_v1h.value);});(document.head||document.documentElement).appendChild(f_8yrt);})();`}
        </Script>

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
