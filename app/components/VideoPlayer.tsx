"use client";
import { useEffect, useRef } from "react";

// Embed del reproductor VTurb / ConverteAI.
// La librería base (smartplayer.js) se carga en app/layout.tsx.
export default function VideoPlayer({
  account,
  player,
}: {
  account: string;
  player: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    host.innerHTML = `<vturb-smartplayer id="vid-${player}" style="display:block;margin:0 auto;width:100%;max-width:400px"></vturb-smartplayer>`;

    const scriptId = `scr-${player}`;
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = `https://scripts.converteai.net/${account}/players/${player}/v4/player.js`;
      s.async = true;
      document.body.appendChild(s);
    }

    return () => {
      host.innerHTML = "";
    };
  }, [account, player]);

  return <div ref={ref} className="w-full" />;
}
