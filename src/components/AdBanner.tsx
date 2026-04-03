import { useEffect, useState } from "react";
import { X, Code } from "lucide-react";
import { getAdsByPosition, type Ad } from "@/lib/store";

interface AdBannerProps {
  position: Ad["position"];
  className?: string;
}

function ScriptAd({ scriptCode, id }: { scriptCode: string; id: string }) {
  useEffect(() => {
    const headScriptId = `admin-ad-${id}`;
    if (document.getElementById(headScriptId)) return;

    const isScriptTag = /<script/i.test(scriptCode);

    if (isScriptTag) {
      const srcMatch = scriptCode.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        const el = document.createElement("script");
        el.id = headScriptId;
        el.src = srcMatch[1];
        el.async = true;
        document.head.appendChild(el);
      } else {
        const inlineMatch = scriptCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (inlineMatch) {
          const el = document.createElement("script");
          el.id = headScriptId;
          el.text = inlineMatch[1];
          document.head.appendChild(el);
        }
      }
    } else {
      const el = document.createElement("script");
      el.id = headScriptId;
      el.text = scriptCode;
      document.head.appendChild(el);
    }

    return () => {
      const old = document.getElementById(headScriptId);
      if (old) old.remove();
    };
  }, [scriptCode, id]);

  return (
    <div className="flex items-center gap-2 p-3 text-xs text-green-400 bg-green-900/20 rounded-lg border border-green-800/30">
      <Code className="w-3.5 h-3.5 flex-shrink-0" />
      <span>Script iklan aktif</span>
    </div>
  );
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAds(getAdsByPosition(position));
    const handler = () => setAds(getAdsByPosition(position));
    window.addEventListener("ads-updated", handler);
    return () => window.removeEventListener("ads-updated", handler);
  }, [position]);

  const visible = ads.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {visible.map((ad) => {
        if (ad.type === "script" && ad.scriptCode) {
          return (
            <div key={ad.id} className="relative rounded-xl overflow-hidden border border-purple-900/30 bg-[hsl(222,47%,8%)] group p-3">
              <button
                onClick={() => setDismissed((prev) => new Set([...prev, ad.id]))}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Tutup iklan"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <ScriptAd scriptCode={ad.scriptCode} id={ad.id} />
            </div>
          );
        }

        return (
          <div
            key={ad.id}
            className="relative rounded-xl overflow-hidden border border-purple-900/30 bg-[hsl(222,47%,8%)] group"
          >
            <button
              onClick={() => setDismissed((prev) => new Set([...prev, ad.id]))}
              className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Tutup iklan"
            >
              <X className="w-3 h-3 text-white" />
            </button>
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored">
              {ad.imageUrl ? (
                <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full h-20 flex items-center justify-center bg-purple-900/20">
                  <span className="text-purple-300 font-semibold text-sm">{ad.title}</span>
                </div>
              )}
            </a>
            <div className="absolute top-1 left-2">
              <span className="text-[10px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded">Iklan</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
