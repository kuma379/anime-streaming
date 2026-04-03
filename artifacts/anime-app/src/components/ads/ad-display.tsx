import { useEffect, useState } from "react";

interface Ad {
  id: string;
  position: string;
  type: "script" | "image";
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
}

interface AdDisplayProps {
  position: "top" | "bottom" | "sidebar";
}

export function AdDisplay({ position }: AdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("anistream_ads");
      if (stored) {
        const all: Ad[] = JSON.parse(stored);
        setAds(all.filter((a) => a.active && a.position === position));
      }
    } catch {}
  }, [position]);

  if (ads.length === 0) return null;

  return (
    <div className={`w-full flex flex-col gap-2 ${position === "top" ? "border-b border-border/30" : position === "bottom" ? "border-t border-border/30" : ""}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="w-full overflow-hidden">
          {ad.type === "image" && ad.imageUrl ? (
            ad.linkUrl ? (
              <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                <img src={ad.imageUrl} alt="Advertisement" className="w-full h-auto max-h-24 object-cover" />
              </a>
            ) : (
              <img src={ad.imageUrl} alt="Advertisement" className="w-full h-auto max-h-24 object-cover" />
            )
          ) : ad.type === "script" ? (
            <ScriptAd script={ad.content} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ScriptAd({ script }: { script: string }) {
  useEffect(() => {
    const container = document.getElementById("script-ad-container-" + Math.random());
    if (!container) return;
    const range = document.createRange();
    range.selectNode(container);
    const fragment = range.createContextualFragment(script);
    container.appendChild(fragment);
  }, [script]);

  return <div className="w-full py-1 text-center" dangerouslySetInnerHTML={{ __html: script }} />;
}
